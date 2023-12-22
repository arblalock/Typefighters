'use client'
import { useEffect, useState } from 'react'
import { useRouter } from "next/navigation"
import { CenterContainer } from "@/components/CenterContainer";
import { ShareableLink } from '@/components/ShareableLink';
import { SocketClient } from '@/lib/socket';
import { PlayerData, IPlayerData, IMatchRoom, MatchRoom } from '@/common/game';
import { LocalStorageGetPlayerData, LocalStorageStorePlayerData } from '@/utils/localStorage';
import { getTxt } from "@/lib/text";
import { IMatchAndPlayer } from "@/common/io";
import { ConfirmationCheck } from "@/components/ConfirmationCheck";
import { StatusLoader } from "@/components/StatusLoader";
import { useMatchData, usePlayerData } from "@/hooks/gameDataEffects";

export default function Page() {
    const [client, setClient] = useState<SocketClient>();
    const [matchRoom, setMatchData] = useMatchData();
    const [statusTxt, setStatusTxt] = useState<string>(getTxt("Loading"));
    const [matchReady, setMatchReady] = useState<boolean>(false);
    const [myPlayerData, setMyPlayerData] = usePlayerData();
    const [matchUrl, setMatchUrl] = useState<string>();
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
        if (matchReady && matchUrl) {
            const timer = setTimeout(() => {
                router.push(matchUrl)
            }, redirectTimeout * 1000);
            return () => clearTimeout(timer);
        }
    }, [matchReady, matchUrl]);

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
        setMyPlayerData(playerData);
        client?.socket.emit("requestNewMatchRoom", playerData);
    }

    const handleMatchRoomCreated = (mr: IMatchRoom) => {
        let matchRoom = MatchRoom.matchRoomFromJSON(mr);
        setMatchData(matchRoom);
        let playerDat = matchRoom.getPlayerById(myPlayerData?.playerId);
        if (playerDat) {
            updateMyPlayerData(playerDat);
        }
        setMatchUrl(`${window.location.origin}/MatchRoom/${matchRoom.roomCode}`)
        setStatusTxt(getTxt("FriendJoinWaiting"));
    }

    const updateMyPlayerData = (playerData: PlayerData) => {
        LocalStorageStorePlayerData(playerData);
        setMyPlayerData(playerData);
    }

    const handleMatchRoomJoinedEvent = ({ matchRoom }: IMatchAndPlayer) => {
        let mr = MatchRoom.matchRoomFromJSON(matchRoom);
        if (mr.allPlayersJoined()) {
            let pdat = myPlayerData;
            if (pdat && pdat.playerId) {
                pdat.myOpponentId = mr.getMyOpponent(pdat.playerId)?.playerId
                updateMyPlayerData(pdat);
            }
            setStatusTxt(getTxt("MatchReady"));
            setMatchReady(true);
            //Note: setMatchReady triggers a useEffect hook to do page redirect
        }
    }

    // const matchRoomUrl = (): string => {
    //     if (matchRoom) {
    //         return `${window.location.origin}/MatchRoom/${matchRoom.roomCode}`
    //     }
    //     return ""
    // }

    return (
        <CenterContainer>
            {matchRoom && matchUrl &&
                <div className="flex-col item-center justify-center">
                    <div className="m-2 text-4xl cl-dark-7">
                        Give your friend this link:
                    </div>
                    <div className="m-2">
                        <ShareableLink linkTxt={matchUrl} />
                    </div>
                </div>
            }
            <div className="flex-col item-center justify-center">
                {!matchReady && <StatusLoader statusTxt={statusTxt} />}
                {matchReady &&
                    <div>
                        <div className="m-6 cl-blue-1"><ConfirmationCheck /></div>
                        <div className={"text-6xl m-2 mb-8 cl-blue-1 ani-fadeIn"}>{statusTxt}</div>
                    </div>
                }
            </div>
        </CenterContainer>
    )
}