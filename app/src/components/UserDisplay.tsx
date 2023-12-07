import { MatchRoom, PlayerData } from "@/common/game";
import { Button } from "./Button"
import { CenterContainer } from "./CenterContainer"
import { getTxt } from "@/lib/text";
// import { useEffect, useState } from "react";

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

export const UserDisplay = ({ playerData, matchData, inputCB }: UserDspProps) => {

    // const [matchRoom, setMatchRoom] = useState<MatchRoom>();
    // const [myPlayerData, setMyPlayerData] = useState<PlayerData>();

    // useEffect(() => {
    //     setMatchRoom(matchData);
    //     setMyPlayerData(playerData);
    // }, [playerData, matchData]);

    const handlePlayerClickReady = () => {
        console.log("testing");
        inputCB({ "inputType": "isReadyClick", "input": "" })
    }

    return (
        <CenterContainer margin={0}>
            {(!playerData || playerData.readyForMatchStart) == false &&
                <Button text={getTxt("ReadyBtn")} callback={handlePlayerClickReady} textSize="3xl" buttonStyle="alt1" />
            }
        </CenterContainer>
    )
}