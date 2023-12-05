import { MatchRoom, PlayerData } from "@/common/game";
import { CenterContainer } from "./CenterContainer";
import { StatusLoader } from "./StatusLoader";
import { getTxt } from "@/lib/text";

type OpponentDspProps = {
    playerData: PlayerData | undefined;
    matchData: MatchRoom | undefined;
}

export const OpponentDisplay = ({ playerData, matchData }: OpponentDspProps) => {
    const getStatusTxt = (): string => {
        let result = getTxt("FriendJoinWaiting");
        if (matchData && playerData) {
            result = getTxt("FriendWaitReady");
            if (playerData.readyForMatchStart) {
                result = getTxt("FriendReady")
            }
        }
        return result;
    }

    return (
        <CenterContainer>
            <StatusLoader statusTxt={getStatusTxt()} />
        </CenterContainer>
    )
}