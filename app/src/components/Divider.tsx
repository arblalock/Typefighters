import { CenterContainer } from "./CenterContainer"

type DivProps = {
    margin?: number;
}

export const Divider = ({ margin = 1 }: DivProps) => {
    return (
        <CenterContainer margin={margin}>
            <div className="w-full h-px dark-bg-6" />
        </CenterContainer>
    )
}   