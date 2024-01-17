// import styles from './Loader.module.css'

import { MatchRoom, PlayerData } from "@/common/game"
import { Divider } from "./Divider"

type ScoreboardProps = {
    matchData: MatchRoom;
    myData: PlayerData;
    oppData: PlayerData;
}

export const ScoreHistory = ({ matchData, myData, oppData }: ScoreboardProps) => {
    return (
        <div>
            {matchData &&
                // {matchData.matchIsRunning &&
                <div className="w-full">
                    <div className="text-lg">Match History</div>
                    <Divider margin={0.5} background="dark-bg-4" />
                    <div className="text-justify indent-3">
                        <div>{`You: ${myData.gamesWon}`}</div>
                        <div>{`Opponent: ${oppData.gamesWon}`}</div>
                    </div>
                </div>
            }
        </div>
    )
}