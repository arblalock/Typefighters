import { MatchRoom } from "@/common/game";
import { Divider } from "./Divider";

type GameCenterDspProps = {
    matchData: MatchRoom | undefined;
    timer: number;
}

export const GameCenterDisplay = ({ matchData, timer }: GameCenterDspProps) => {

    const getDisplayText = (): string => {
        if (matchData?.matchIsRunning && matchData.currentRound === 1 && timer > 0) {
            return `Game starting in ${timer}...`
        }

        return "Testing"
    }

    return (
        <div className="flex justify-center">
            {matchData?.matchIsRunning == false && <Divider margin={2} />}
            {matchData?.matchIsRunning &&
                <div className="w-[98%] text-slate-350 my-8 text-3xl p-7 dark-bg-2 border border-slate-800 rounded">
                    {getDisplayText()}
                </div>
            }
        </div>
    )
}