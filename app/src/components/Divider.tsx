import { CenterContainer } from "./CenterContainer"

type DivProps = {
    margin?: number;
    background?: string
}

export const Divider = ({ margin = 1, background = "dark-bg-6" }: DivProps) => {
    return (
        <CenterContainer margin={margin}>
            <div className={`w-full h-px ${background}`} />
        </CenterContainer>
    )
}   