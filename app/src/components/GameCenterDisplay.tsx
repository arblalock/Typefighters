import { MatchRoom } from "@/common/game";
import { Divider } from "./Divider";

type GameCenterDspProps = {
    matchData: MatchRoom | undefined;
}

export const GameCenterDisplay = ({ matchData }: GameCenterDspProps) => {

    const getDisplayText = () => {
        return "Testing"
    }

    return (
        <div>
            {matchData?.matchIsRunning == false && <Divider margin={2} />}
            {matchData?.matchIsRunning &&
                <div>
                    {getDisplayText()}
                </div>
            }
        </div>
    )
}