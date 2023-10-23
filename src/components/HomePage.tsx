import { Button } from "@/components/Button"

export const HomePage = () => {
    return (
        <div className="flex flex-col m-4 items-center text-center justify-center dark">
            <div className="m-2 w-1/2">
                <div className="text-xl-vw">TypeFighters</div>
            </div>
            <div className="m-6">
                <Button text="Matchmaking" url="/MatchRoom?type=mm" textSize="3xl" buttonStyle="primary" btnSize="xl" />
                <Button text="Play with friend" url="/MatchRoom?type=pwf" textSize="3xl" buttonStyle="primary" btnSize="xl" />
            </div>
        </div>
    )
}