// import styles from './Loader.module.css'

import { MatchRoom, PlayerData } from "@/common/game"
import { Divider } from "./Divider"
import { Config } from "@/common/config";

type ScoreboardProps = {
    matchData: MatchRoom;
    myData: PlayerData;
    oppData: PlayerData;
}

export const Scoreboard = ({ matchData, myData, oppData }: ScoreboardProps) => {
    return (
        <div>
            {matchData &&
                // {matchData.matchIsRunning &&
                <div className="w-full">
                    <div className="text-lg">Score</div>
                    <Divider margin={0.5} background="dark-bg-4" />
                    <div className="text-justify indent-3">
                        <div className="text-slate-200 font-bold">{`You: ${myData.currentScore}`}</div>
                        <div>{`Opponent: ${oppData.currentScore}`}</div>
                        <div className="text-justify text-slate-500 mt-2 indent-3">{`Round: ${matchData.currentRound}/${Config.roundsPerGame}`}</div>
                    </div>

                </div>
            }
        </div>
    )
}