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
import { Scoreboard } from "@/components/Scoreboard";
import { GameInfoPanel } from "@/components/GameInfoPanel";

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
    let pd = LocalStorageGetPlayerData();
    if (pd && pd.playerId && matchRoom) {
      syncMatchData(matchRoom, pd.playerId);
    }
  }, [myPlayerData, matchRoom]);

  useEffect(() => {
    if (client) {
      client.socket.on('connect', handleSockConnect);
      client.socket.on('userSessionCreatedEvent', handleUserSessionCreated);
      client.socket.on('matchRoomJoinedEvent', handleMatchRoomJoinedEvent);
      client.socket.on('matchUpdateEvent', handleMatchDataUpdateEvent);

      return () => {
        client.socket.off('connect', handleSockConnect);
        client.socket.off('userSessionCreatedEvent', handleUserSessionCreated);
        client.socket.off('matchRoomJoinedEvent', handleMatchRoomJoinedEvent);
        client.socket.off('matchUpdateEvent', handleMatchDataUpdateEvent);
      };
    }
  }, [client]);

  const handleSockConnect = () => {
    if (!client) return;
    let playerData = LocalStorageGetPlayerData();
    if (playerData == null) {
      playerData = new PlayerData();
    }
    client?.socket.emit("requestUserSession", playerData)
  }

  const handleUserSessionCreated = (pd: IPlayerData) => {
    let playerData = PlayerData.PlayerDataFromJSON(pd);
    let roomCode = params.roomcode.toString();
    updatePlayerData(playerData);
    console.log("session joined");
    console.log(playerData);
    client?.socket.emit("requestJoinMatchRoom", { playerData: playerData, roomCode: roomCode });
  }

  const handleMatchRoomJoinedEvent = ({ matchRoom, playerData }: IMatchAndPlayer) => {
    if (playerData === null || matchRoom === null) {
      setStatusTxt(getTxt("ErrTooManyPlayers"));
      return;
    }

    let matchData = MatchRoom.matchRoomFromJSON(matchRoom);
    let pd = PlayerData.PlayerDataFromJSON(playerData);
    let myPlayer = LocalStorageGetPlayerData();
    //Check if this is me joining
    if (pd.playerId === myPlayer?.playerId) {

      //REMOVE AFTER DEBUG
      console.log("clearing");
      pd.readyForMatchStart = false;
      matchData.updatePlayerData(pd);
      client?.socket.emit("matchUpdate", pd);
      //END REMOVE AFTER DEBUG

      updatePlayerData(pd);
      syncMatchData(matchData, pd.playerId);
      if (joinedMatch === false) {
        setJoinedMatch(true);
      }
    }
    else {
      syncMatchData(matchData);
    }
  }

  const handleMatchDataUpdateEvent = (mr: MatchRoom) => {
    mr = MatchRoom.matchRoomFromJSON(mr);
    if (matchRoom) {
      syncMatchData(mr, LocalStorageGetPlayerData()?.playerId)
    }
  }

  const updatePlayerData = (pd: PlayerData) => {
    if (opponentPlayerData) pd.myOpponentId = opponentPlayerData.playerId;
    pd.currentRoom = params.roomcode.toString();
    if (matchRoom) {
      matchRoom.updatePlayerData(pd);
      setMatchData(matchRoom);
    }
    setMyPlayerData(pd);
    LocalStorageStorePlayerData(pd);
  }

  //Sync our local state with data from server
  const syncMatchData = (matchData: MatchRoom, myPlayerId?: string) => {
    //Attempt to get our data from match data
    let myDat = matchData.getPlayerById(myPlayerId);
    if (myDat && myDat.playerId) {
      let oppDat = matchData.getMyOpponent(myDat.playerId);
      if (oppDat) {
        setOpponentPlayerData(oppDat);
      }
    }
    setMatchData(matchData);
  }

  const readyToStartClick = () => {
    let pd = LocalStorageGetPlayerData();
    if (pd?.playerId) {
      let uDat = pd;
      uDat.readyForMatchStart = true;
      updatePlayerData(uDat);
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
        <div className="w-full flex flex-row">
          <div className="basis-10/12 items-center">
            <UserDisplay playerData={myPlayerData} matchData={matchRoom} inputCB={handleUserInput}>
            </UserDisplay>
            <Divider margin={2} />
            <OpponentDisplay playerData={opponentPlayerData} matchData={matchRoom} />
          </div>
          <div className="basis-2/12 items-center justify-center">
            <GameInfoPanel>
              <Scoreboard matchData={matchRoom} myData={myPlayerData} oppData={opponentPlayerData} />
            </GameInfoPanel>
            <GameInfoPanel>
              <Scoreboard matchData={matchRoom} myData={myPlayerData} oppData={opponentPlayerData} />
            </GameInfoPanel>
          </div>
        </div>
      }
    </CenterContainer>
  )
}