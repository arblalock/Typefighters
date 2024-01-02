'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { CenterContainer } from "@/components/CenterContainer";
import { SocketClient } from '@/lib/socket';
import { PlayerData, IPlayerData, IMatchRoom, MatchRoom } from '@/common/game';
import { LocalStorageGetPlayerData, LocalStorageStorePlayerData } from '@/utils/localStorage';
import { IMatchAndPlayer } from "@/common/io";
import { getTxt } from "@/lib/text";
import { OpponentDisplay } from "@/components/OpponentDisplay";
import { UserDisplay, UserInput } from "@/components/UserDisplay";
import { StatusLoader } from "@/components/StatusLoader";
import { Divider } from "@/components/Divider";
import { useMatchData, usePlayerData } from "@/hooks/gameDataEffects";

export default function Page() {
  const [client, setClient] = useState<SocketClient>();
  const [matchRoom, setMatchData] = useMatchData();
  const [myPlayerData, setMyPlayerData] = usePlayerData();
  const [opponentPlayerData, setOpponentPlayerData] = usePlayerData();
  const [statusTxt, setStatusTxt] = useState<string>(getTxt("Loading"));
  const [joinedMatch, setJoinedMatch] = useState<Boolean>(false);
  const params = useParams()

  useEffect(() => {
    setClient(new SocketClient());
  }, []);

  useEffect(() => {
    if (myPlayerData && myPlayerData.playerId && matchRoom) {
      syncMatchData(matchRoom, myPlayerData.playerId);
    }
  }, [myPlayerData, matchRoom]);

  useEffect(() => {
    if (client) {
      client.socket.on('connect', handleSockConnect);
      client.socket.on('userSessionCreatedEvent', handleUserSessionCreated);
      client.socket.on('matchRoomJoinedEvent', handleMatchRoomJoinedEvent);
      client.socket.on('userMatchUpdateEvent', handleUserDataUpdateEvent);

      return () => {
        client.socket.off('connect', handleSockConnect);
        client.socket.off('userSessionCreatedEvent', handleUserSessionCreated);
        client.socket.off('matchRoomJoinedEvent', handleMatchRoomJoinedEvent);
        client.socket.off('userMatchUpdateEvent', handleUserDataUpdateEvent);
      };
    }
  }, [client]);

  const handleSockConnect = () => {
    if (!client) return;
    let playerData = LocalStorageGetPlayerData();
    if (playerData == null) {
      playerData = new PlayerData(client.socket.id);
    } else {
      playerData.socketId = client.socket.id;
    }
    client?.socket.emit("requestUserSession", playerData)
  }

  const handleUserSessionCreated = (pd: IPlayerData) => {
    let playerData = PlayerData.PlayerDataFromJSON(pd);
    let roomCode = params.roomcode.toString();
    updateMyLocalPlayerData(playerData);
    console.log("session created");
    client?.socket.emit("requestJoinMatchRoom", { playerData: playerData, roomCode: roomCode });
  }

  const updateMyLocalPlayerData = (pd: PlayerData) => {
    if (opponentPlayerData) pd.myOpponentId = opponentPlayerData.playerId;
    if (matchRoom) {
      pd.currentRoom = matchRoom.roomCode;
      matchRoom.updatePlayerData(pd);
      setMatchData(matchRoom);
    }
    else {
      let roomCode = params.roomcode.toString();
      pd.currentRoom = roomCode;
    }
    console.log(pd)
    setMyPlayerData(pd);
    LocalStorageStorePlayerData(pd);
  }

  //Sync our local state with data from server
  const syncMatchData = (matchData: MatchRoom, myPlayerId?: string) => {
    //Attempt to get our data from match data
    let myDat = matchData.getPlayerById(myPlayerId, client?.socketID);
    if (myDat && myDat.playerId) {
      let oppDat = matchData.getMyOpponent(myDat.playerId);
      if (oppDat) {
        setOpponentPlayerData(oppDat);
      }
      if (joinedMatch === false) {
        setJoinedMatch(true);
      }
    }
    setMatchData(matchData);
  }

  const handleMatchRoomJoinedEvent = ({ matchRoom, playerData }: IMatchAndPlayer) => {
    if (playerData === null || matchRoom === null) {
      setStatusTxt(getTxt("ErrTooManyPlayers"));
      return;
    }
    let matchData = MatchRoom.matchRoomFromJSON(matchRoom);

    //REMOVE AFTER DEBUG
    console.log("clearing");
    let pd = PlayerData.PlayerDataFromJSON(playerData);
    pd.readyForMatchStart = false;
    matchData.updatePlayerData(pd);
    client?.socket.emit("userMatchUpdate", pd);

    //If we have all match data then update players
    if (myPlayerData && myPlayerData.playerId) {
      syncMatchData(matchData, myPlayerData.playerId)
      updateMyLocalPlayerData(pd);
    }
    else {
      setMatchData(matchData);
    }
  }

  const handleUserDataUpdateEvent = (pd: PlayerData) => {
    let md = matchRoom;
    console.log("user update")
    if (md) {
      // console.log(pd)
      md?.updatePlayerData(pd);
      syncMatchData(md, myPlayerData?.playerId)
    }
  }

  const readyToStartClick = () => {
    if (myPlayerData) {
      let uDat = myPlayerData;
      uDat.readyForMatchStart = true;
      console.log(myPlayerData);
      updateMyLocalPlayerData(uDat);
      client?.socket.emit("userMatchUpdate", uDat);
    }
  }

  const handleUserInput = (payload: UserInput) => {
    switch (payload.inputType) {
      case "isReadyClick":
        readyToStartClick();
        break;
      case "stringInput":
        break;
    }
  }

  return (
    <CenterContainer margin={0.5}>
      {!joinedMatch &&
        <StatusLoader statusTxt={statusTxt} />
      }
      {joinedMatch &&
        <div className="w-full">
          <UserDisplay playerData={myPlayerData} matchData={matchRoom} inputCB={handleUserInput} />
          <Divider margin={2} />
          <OpponentDisplay playerData={opponentPlayerData} matchData={matchRoom} />
        </div>
      }
    </CenterContainer>
  )
}