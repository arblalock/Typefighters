'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { CenterContainer } from "@/components/CenterContainer";
import { SocketClient } from '@/lib/socket';
import { PlayerData, IPlayerData, IMatchRoom, MatchRoom } from '@/common/game';
import { LocalStorageGetPlayerData, LocalStorageStorePlayerData } from '@/utils/localStorage';
import { Loader } from '@/components/Loader';
import { IMatchAndPlayer } from "@/common/io";
import { getTxt } from "@/lib/text";

export default function Page() {
  const [client, setClient] = useState<SocketClient>();
  const [matchRoom, setMatchRoom] = useState<MatchRoom>();
  const [statusTxt, setStatusTxt] = useState<string>("Loading");
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
    LocalStorageStorePlayerData(playerData);
    let roomCode = params.roomcode;
    client?.socket.emit("requestJoinMatchRoom", { playerData: playerData, roomCode: roomCode });
  }

  const handleMatchRoomJoinedEvent = ({ matchRoom, playerData }: IMatchAndPlayer) => {
    if (playerData === null || matchRoom === null) {
      setStatusTxt(getTxt("ErrTooManyPlayers"));
      return;
    }
    LocalStorageStorePlayerData(PlayerData.PlayerDataFromJSON(playerData))
    console.log("joined match!");
    console.log(matchRoom);
  }

  return (
    <CenterContainer>
      <div className="flex-col item-center justify-center">
        <div className="m-10"><Loader /></div>
        <div className="text-2xl m-2 mb-8 cool-blue">{statusTxt}</div>
      </div>
    </CenterContainer>
  )
}