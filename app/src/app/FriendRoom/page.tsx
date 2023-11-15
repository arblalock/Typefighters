'use client'
import { useEffect, useState } from 'react'
import { CenterContainer } from "@/components/CenterContainer";
import { ShareableLink } from '@/components/ShareableLink';
import { SocketClient } from '@/lib/socket';
import { PlayerData } from '@/common/game';
import { LocalStorageGetPlayerID, LocalStorageSetPlayerID } from '@/utils/localStorage';

export default function Page() {
    const [client, setClient] = useState<SocketClient>();

    useEffect(() => {
        setClient(new SocketClient());
    }, []);

    useEffect(() => {
        if (client) {
            client.socket.on('connect', handleSockConnect);
            client.socket.on('userSessionCreatedEvent', handleUserSessionCreated);
            return () => {
                client.socket.off('connect', handleSockConnect);
                client.socket.off('userSessionCreatedEvent', handleUserSessionCreated);
            };
        }
    }, [client]);

    const handleSockConnect = () => {
        if (!client) return;
        const pid = LocalStorageGetPlayerID();
        const playerData = new PlayerData(client.socket.id);
        if (pid) {
            playerData.playerId = pid;
        }
        client?.socket.emit("requestUserSession", playerData)
    }

    const handleUserSessionCreated = (playerData: PlayerData) => {
        LocalStorageSetPlayerID(playerData.playerId);
        client?.socket.emit("requestNewGameRoom", playerData);
    }

    return (
        <CenterContainer>
            <div className="m-2 text-4xl">
                Give your friend this link:
            </div>
            <div className="m-2">
                <ShareableLink linkTxt="testingalink.com" />
            </div>
        </CenterContainer>
    )
}