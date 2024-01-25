import { CenterContainer } from "./CenterContainer"

type DivProps = {
    margin?: number;
    background?: string
}

export const Divider = ({ margin = 1, background = "dark-bg-6" }: DivProps) => {
    return (
        <div style={{
            margin: `${margin}rem`,
        }} className="w-full">
            <div className={`w-full h-px ${background}`} />
        </div>
    )
}   