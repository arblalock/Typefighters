'use client'
import { useEffect, useState } from 'react'
import { CenterContainer } from "@/components/CenterContainer";
import { ShareableLink } from '@/components/ShareableLink';
import { SocketClient } from '@/lib/socket';
import { PlayerData, IPlayerData, IGameRoom, GameRoom } from '@/common/game';
import { LocalStorageGetPlayerData, LocalStorageStorePlayerData } from '@/utils/localStorage';
import { Loader } from '@/components/Loader';

export default function Page() {
    const [client, setClient] = useState<SocketClient>();
    const [gameRoom, setGameRoom] = useState<GameRoom>();
    const [statusTxt, setStatusTxt] = useState<string>("Loading");

    useEffect(() => {
        setClient(new SocketClient());
    }, []);

    useEffect(() => {
        if (client) {
            client.socket.on('connect', handleSockConnect);
            client.socket.on('userSessionCreatedEvent', handleUserSessionCreated);
            client.socket.on('gameRoomCreatedEvent', handleGameRoomCreated);
            return () => {
                client.socket.off('connect', handleSockConnect);
                client.socket.off('userSessionCreatedEvent', handleUserSessionCreated);
                client.socket.off('gameRoomCreatedEvent', handleGameRoomCreated);
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
        client?.socket.emit("requestNewGameRoom", playerData);
    }

    const handleGameRoomCreated = (gr: IGameRoom) => {
        //TODO: set gameRoom, change status text to waiting for friend to join
    }

    const matchRoomUrl = (): string => {
        if (gameRoom) {
            return `${window.location}/MatchRoom/${gameRoom.roomCode}`
        }
        return ""
    }

    return (
        <CenterContainer>
            {gameRoom &&
                <div>
                    <div className="m-2 text-4xl">
                        Give your friend this link:
                    </div>
                    <div className="m-2">
                        <ShareableLink linkTxt={matchRoomUrl()} />
                    </div>
                </div>
            }
            <div className="flex-col item-center justify-center m-2">
                <div className="text-4xl m-2">{statusTxt}</div>
                <div className="m-10"><Loader /></div>
            </div>

        </CenterContainer>
    )
}