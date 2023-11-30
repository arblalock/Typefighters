'use client'
import { useEffect, useState } from 'react'
import { CenterContainer } from "@/components/CenterContainer";
import { ShareableLink } from '@/components/ShareableLink';
import { SocketClient } from '@/lib/socket';
import { PlayerData, IPlayerData, IMatchRoom, MatchRoom } from '@/common/game';
import { LocalStorageGetPlayerData, LocalStorageStorePlayerData } from '@/utils/localStorage';
import { Loader } from '@/components/Loader';

export default function Page() {
    const [client, setClient] = useState<SocketClient>();
    const [matchRoom, setMatchRoom] = useState<MatchRoom>();
    const [statusTxt, setStatusTxt] = useState<string>("Loading...");
    const waitingTxt = "Waiting for friend to join..."

    useEffect(() => {
        setClient(new SocketClient());
    }, []);

    useEffect(() => {
        if (client) {
            client.socket.on('connect', handleSockConnect);
            client.socket.on('userSessionCreatedEvent', handleUserSessionCreated);
            client.socket.on('matchRoomCreatedEvent', handleMatchRoomCreated);
            return () => {
                client.socket.off('connect', handleSockConnect);
                client.socket.off('userSessionCreatedEvent', handleUserSessionCreated);
                client.socket.off('matchRoomCreatedEvent', handleMatchRoomCreated);
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
        client?.socket.emit("requestNewMatchRoom", playerData);
    }

    const handleMatchRoomCreated = (mr: IMatchRoom) => {
        console.log(mr);
        setMatchRoom(MatchRoom.matchRoomFromJSON(mr));
        setStatusTxt(waitingTxt);
    }

    const matchRoomUrl = (): string => {
        if (matchRoom) {
            return `${window.location.origin}/MatchRoom/${matchRoom.roomCode}`
        }
        return ""
    }

    return (
        <CenterContainer>
            {matchRoom &&
                <div className="flex-col item-center justify-center">
                    <div className="m-2 text-4xl cl-dark-4">
                        Give your friend this link:
                    </div>
                    <div className="m-2">
                        <ShareableLink linkTxt={matchRoomUrl()} />
                    </div>
                </div>
            }
            <div className="flex-col item-center justify-center">
                <div className="m-10"><Loader /></div>
                <div className="text-2xl m-2 mb-8 cool-blue">{statusTxt}</div>
            </div>

        </CenterContainer>
    )
}