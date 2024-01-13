// import styles from './Loader.module.css'

import { MatchRoom, PlayerData } from "@/common/game"
import { Divider } from "./Divider"

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
                <div className="relative w-full">
                    <div className="absolute w-30 p-5 top-0 left-0 dark-bg-6">
                        <div className="text-lg">Score</div>
                        <Divider margin={0.5} background="dark-bg-4" />
                        <div>
                            <div>{`You: ${myData.currentScore}`}</div>
                            <div>{`Opponent: ${oppData.currentScore}`}</div>
                            <div>{`Round: ${matchData.currentRound}/${matchData.currentRound}`}</div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}