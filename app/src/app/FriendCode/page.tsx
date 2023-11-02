import { Button } from "@/components/Button";
import { CenterContainer } from "@/components/CenterContainer";

export default function Page() {

    return (
        <CenterContainer>
            <div className="m-2">
                <Button text="Create Game" textSize="3xl" buttonStyle="primary" />
            </div>
            <div className="text-base">------ OR ------</div>
            <div className="m-2">
                <div className="m-10">
                    <input className="dark-input max-w-[280px] p-6 input-sm-pl text-4xl text-center" placeholder="Enter Room Code"></input>
                </div>
            </div>
        </CenterContainer>
    )
}