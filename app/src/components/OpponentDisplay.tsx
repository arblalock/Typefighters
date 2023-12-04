import { CenterContainer } from "./CenterContainer";
import { StatusLoader } from "./StatusLoader";

type OpponentDspProps = {
    statusTxt: string;
}

export const OpponentDisplay = ({ statusTxt }: OpponentDspProps) => {
    return (
        <CenterContainer>
            <StatusLoader statusTxt={statusTxt} />
        </CenterContainer>
    )
}