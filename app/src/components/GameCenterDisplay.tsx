import { MatchRoom } from "@/common/game";
import { Divider } from "./Divider";
import { ReactNode } from "react";

type GameCenterDspProps = {
    matchData: MatchRoom | undefined;
    timer: number | undefined;
}

export const GameCenterDisplay = ({ matchData, timer }: GameCenterDspProps) => {

    const getDisplay = (): ReactNode => {
        console.log(timer);
        if (!matchData || matchData.matchIsRunning === false || timer === undefined) {
            return (<Divider margin={2} />)
        }
        let text = ''
        if (matchData?.matchIsRunning && matchData.currentRound === 1 && timer > 0) {
            text = `Game starting in ${timer}...`
        }
        else {
            console.log(matchData.currentTxt);
            text = matchData.currentTxt;
        }
        return (
            <div className="w-[98%] text-slate-350 my-8 text-3xl p-7 dark-bg-2 border border-slate-800 rounded">
                {text}
            </div>
        )
    }

    return (
        <div className="flex justify-center">
            {getDisplay()}
        </div>

    )
}