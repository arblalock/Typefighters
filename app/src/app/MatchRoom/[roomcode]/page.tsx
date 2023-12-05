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
    updateMyPlayerData(playerData);
    let roomCode = params.roomcode;
    client?.socket.emit("requestJoinMatchRoom", { playerData: playerData, roomCode: roomCode });
  }

  const updateMyPlayerData = (pd: PlayerData) => {
    setMyPlayerData(pd);
    LocalStorageStorePlayerData(pd);
  }

  const handleMatchRoomJoinedEvent = ({ matchRoom, playerData }: IMatchAndPlayer) => {
    if (playerData === null || matchRoom === null) {
      setStatusTxt(getTxt("ErrTooManyPlayers"));
      return;
    }
    let pDat = PlayerData.PlayerDataFromJSON(playerData);
    //If the player is joined is me then update my info
    if (pDat.playerId === myPlayerData?.playerId) {
      setJoinedMatch(true);
      updateMyPlayerData(pDat);
      console.log("joined match!");
    }
    //If this is my opponent joining
    else {
      console.log("opponent joined match!");
      setOpponentPlayerData(pDat);
      if (myPlayerData !== undefined) {
        let myPdat = myPlayerData;
        myPdat.myOpponentId = pDat.playerId;
        updateMyPlayerData(pDat);
      }
    }
    console.log(matchRoom);
    matchUpdate(MatchRoom.matchRoomFromJSON(matchRoom));
  }

  const matchUpdate = (matchRoom: MatchRoom) => {
    setMatchRoom(matchRoom);
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