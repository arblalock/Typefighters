'use client'
import { useEffect } from 'react'
import { CenterContainer } from "@/components/CenterContainer";
import { ShareableLink } from "@/components/ShareableLink";
import { SocketClient } from '@/lib/socket';

export default function Page() {

    useEffect(() => {
        let client = new SocketClient();
        console.log("loading...")
        client.socket.on('connect', handleSockConnect)
        return () => {
            client.socket.off('connect', handleSockConnect);
        };
    }, []);

    const handleSockConnect = () => {
        console.log("socket connected");
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