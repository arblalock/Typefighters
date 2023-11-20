'use client'
import { useEffect, useState } from 'react'
import { CenterContainer } from "@/components/CenterContainer";
import { ShareableLink } from '@/components/ShareableLink';
import { SocketClient } from '@/lib/socket';
import { PlayerData, IPlayerData } from '@/common/game';
import { LocalStorageGetPlayerData, LocalStorageStorePlayerData } from '@/utils/localStorage';

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
        let playerData = LocalStorageGetPlayerData();
        if (playerData == null) {
            playerData = new PlayerData(client.socket.id);
        } else {
            playerData.socketId = client.socket.id;
        }
        client?.socket.emit("requestUserSession", playerData)
    }

    const handleUserSessionCreated = (pd: IPlayerData) => {
        let playerData = PlayerData.PlayerDataFromObj(pd);
        LocalStorageStorePlayerData(playerData);
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