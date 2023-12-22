import { MatchRoom, PlayerData } from "@/common/game";
import { Button } from "./Button"
import { CenterContainer } from "./CenterContainer"
import { getTxt } from "@/lib/text";
import { ConfirmationCheck } from "./ConfirmationCheck";
import { useEffect, useState } from "react";

type UserDspProps = {
    playerData: PlayerData | undefined;
    matchData: MatchRoom | undefined;
    inputCB: UserInputCallback;
}

export type UserInputCallback = (payLoad: UserInput) => void;

export type UserInputType =
    "isReadyClick" |
    "stringInput"

export type UserInput = {
    inputType: UserInputType,
    input: string
}

export const UserDisplay = ({ playerData: pd, matchData: md, inputCB }: UserDspProps) => {

    const [matchData, setMatchRoom] = useState<MatchRoom>();
    const [playerData, setMyPlayerData] = useState<PlayerData>();

    useEffect(() => {
        setMatchRoom(md);
        setMyPlayerData(pd);
    }, [pd, md]);

    const handlePlayerClickReady = () => {
        inputCB({ "inputType": "isReadyClick", "input": "" })
    }

    const getUserDisplay = () => {
        if (!playerData || playerData.readyForMatchStart === false) {
            return (
                <Button
                    text={getTxt("ReadyBtn")}
                    callback={handlePlayerClickReady}
                    textSize="3xl"
                    buttonStyle="alt1"
                />
            )
        }
        else if (playerData.readyForMatchStart === true) {
            return (
                <div>
                    <div className="m-6 cl-blue-1"><ConfirmationCheck /></div>
                    <div className="text-lg">Ready for match!</div>
                </div>
            )
        }
    }

    return (
        <CenterContainer margin={0}>
            {getUserDisplay()}
        </CenterContainer>
    )
}