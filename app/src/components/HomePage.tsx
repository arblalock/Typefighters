import { Button } from "@/components/Button"
import { CenterContainer } from "./CenterContainer"

export const HomePage = () => {
    return (
        <CenterContainer>
            <div className="m-2 w-1/2">
                <div className="text-xl-vw">TypeFighters</div>
            </div>
            <div className="m-6">
                <Button text="Play with friend" url="/FriendCode" textSize="4xl" buttonStyle="primary" />
                <Button text="Matchmaking (Coming Soon)" url="/MatchRoom" textSize="2xl" buttonStyle="disabled" />
            </div>
        </CenterContainer>
    )
}