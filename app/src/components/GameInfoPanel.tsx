import { ReactNode } from "react"

type GameInfoPanelProps = {
    children: ReactNode;
}

export const GameInfoPanel = ({ children }: GameInfoPanelProps) => {
    return (
        <div className="w-full">
            <div
                style={{ borderColor: "var(--dark-4)" }}
                className="w-30 text-slate-400 p-5 border-solid border dark-bg-1"
            >
                {children}
            </div>
        </div>
    )
}