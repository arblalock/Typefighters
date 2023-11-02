import { Button } from "@/components/Button";
import { CenterContainer } from "@/components/CenterContainer";

export default function Page() {

    return (
        <CenterContainer>
            <div className="m-6">
                <Button text="Create Game" textSize="3xl" buttonStyle="primary" />
            </div>
            <div>------OR-------</div>
            <div className="m-6">
                <div className="">Enter Room Code:</div>
                <div>
                    <input></input>
                </div>
            </div>
        </CenterContainer>
    )
}