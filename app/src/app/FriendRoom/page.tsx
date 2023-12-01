'use client'
import { useEffect, useState } from 'react'
import { useRouter } from "next/navigation"
import { CenterContainer } from "@/components/CenterContainer";
import { ShareableLink } from '@/components/ShareableLink';
import { SocketClient } from '@/lib/socket';
import { PlayerData, IPlayerData, IMatchRoom, MatchRoom } from '@/common/game';
import { LocalStorageGetPlayerData, LocalStorageStorePlayerData } from '@/utils/localStorage';
import { Loader } from '@/components/Loader';
import { getTxt } from "@/lib/text";
import { IMatchAndPlayer } from "@/common/io";
import { ConfirmationCheck } from "@/components/ConfirmationCheck";

export default function Page() {
    const [client, setClient] = useState<SocketClient>();
    const [matchRoom, setMatchRoom] = useState<MatchRoom>();
    const [statusTxt, setStatusTxt] = useState<string>(getTxt("Loading"));
    const [matchReady, setMatchReady] = useState<boolean>(false);
    const router = useRouter();
    const redirectTimeout = 2;

    useEffect(() => {
        setClient(new SocketClient());
    }, []);

    useEffect(() => {
        if (client) {
            client.socket.on('connect', handleSockConnect);
            client.socket.on('userSessionCreatedEvent', handleUserSessionCreated);
            client.socket.on('matchRoomCreatedEvent', handleMatchRoomCreated);
            client.socket.on('matchRoomJoinedEvent', handleMatchRoomJoinedEvent);
            return () => {
                client.socket.off('connect', handleSockConnect);
                client.socket.off('userSessionCreatedEvent', handleUserSessionCreated);
                client.socket.off('matchRoomCreatedEvent', handleMatchRoomCreated);
                client.socket.on('matchRoomJoinedEvent', handleMatchRoomJoinedEvent);
            };
        }
    }, [client]);

    useEffect(() => {
        if (matchReady) {
            const timer = setTimeout(() => {
                router.push(matchRoomUrl())
            }, redirectTimeout * 1000);
            return () => clearTimeout(timer);
        }
    }, [matchReady]);

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
        setStatusTxt(getTxt("FriendJoinWaiting"));
    }

    const handleMatchRoomJoinedEvent = ({ matchRoom, playerData }: IMatchAndPlayer) => {
        let mr = MatchRoom.matchRoomFromJSON(matchRoom);
        if (mr.roomIsFull()) {
            setStatusTxt(getTxt("MatchReady"));
            setMatchReady(true);
            //Note: setMatchReady triggers a useEffect hook to do page redirect
        }
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
                    <div className="m-2 text-4xl cl-dark-7">
                        Give your friend this link:
                    </div>
                    <div className="m-2">
                        <ShareableLink linkTxt={matchRoomUrl()} />
                    </div>
                </div>
            }
            <div className="flex-col item-center justify-center">
                {!matchReady && <div className="m-10"><Loader /></div>}
                {!matchReady && <div className={`text-2xl m-2 mb-8`}>{statusTxt}</div>}
                {matchReady && <div className="m-6 cl-blue-1"><ConfirmationCheck /></div>}
                {matchReady && <div className={"text-6xl m-2 mb-8 cl-blue-1 ani-fadeIn"}>{statusTxt}</div>}
            </div>

        </CenterContainer>
    )
}