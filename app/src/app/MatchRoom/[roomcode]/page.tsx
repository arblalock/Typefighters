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

export default function Page() {
  const [client, setClient] = useState<SocketClient>();
  const [matchRoom, setMatchRoom] = useState<MatchRoom>();
  const [myPlayerData, setMyPlayerData] = useState<PlayerData>();
  const [opponentPlayerData, setOpponentPlayerData] = useState<PlayerData>();
  const [statusTxt, setStatusTxt] = useState<string>(getTxt("Loading"));
  const [joinedMatch, setJoinedMatch] = useState<Boolean>(false);
  const params = useParams()

  useEffect(() => {
    setClient(new SocketClient());
  }, []);

  //Keep our match and player data in sync
  useEffect(() => {
    console.log(myPlayerData);
    if (myPlayerData && myPlayerData.playerId && matchRoom) {
      syncMatchPlayerData(matchRoom, myPlayerData.playerId);
    }
  }, [myPlayerData, matchRoom]);

  useEffect(() => {
    if (client) {
      client.socket.on('connect', handleSockConnect);
      client.socket.on('userSessionCreatedEvent', handleUserSessionCreated);
      client.socket.on('matchRoomJoinedEvent', handleMatchRoomJoinedEvent);
      return () => {
        client.socket.off('connect', handleSockConnect);
        client.socket.off('userSessionCreatedEvent', handleUserSessionCreated);
        client.socket.off('matchRoomJoinedEvent', handleMatchRoomJoinedEvent);
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
    updateMyPlayerData(playerData);
    client?.socket.emit("requestJoinMatchRoom", { playerData: playerData, roomCode: roomCode });
  }

  const updateMyPlayerData = (pd: PlayerData) => {
    if (matchRoom) pd.currentRoom = matchRoom.roomCode;
    if (opponentPlayerData) pd.myOpponentId = opponentPlayerData.playerId;
    setMyPlayerData(pd);
    LocalStorageStorePlayerData(pd);
  }

  //Sync our local state with data from server
  const syncMatchPlayerData = (matchData: MatchRoom, myPlayerId: string) => {
    console.log("server sync...");
    let oppDat = matchData.getMyOpponent(myPlayerId);
    let myDat = matchData.getPlayerById(myPlayerId);
    if (oppDat) {
      setOpponentPlayerData(oppDat);
      if (myDat) myDat.myOpponentId = oppDat.playerId;
    }
    if (myDat) {
      updateMyPlayerData(myDat);
      if (joinedMatch === false) {
        setJoinedMatch(true);
      }
    }
    setMatchRoom(matchData);
  }

  const handleMatchRoomJoinedEvent = ({ matchRoom, playerData }: IMatchAndPlayer) => {
    if (playerData === null || matchRoom === null) {
      setStatusTxt(getTxt("ErrTooManyPlayers"));
      return;
    }
    let matchData = MatchRoom.matchRoomFromJSON(matchRoom);

    //If we have all match data then update players
    if (myPlayerData && myPlayerData.playerId) {
      syncMatchPlayerData(matchData, myPlayerData.playerId)
    }
    else {
      setMatchRoom(matchData);
    }
    console.log(matchData);
  }

  const handleUserInput = (payload: UserInput) => {
    console.log("testing2");
  }

  return (
    <CenterContainer margin={0.5}>
      {!joinedMatch &&
        <StatusLoader statusTxt={statusTxt} />
      }
      {joinedMatch &&
        <div className="w-full">
          <UserDisplay playerData={opponentPlayerData} matchData={matchRoom} inputCB={handleUserInput} />
          <Divider margin={2} />
          <OpponentDisplay playerData={opponentPlayerData} matchData={matchRoom} />
        </div>
      }
    </CenterContainer>
  )
}