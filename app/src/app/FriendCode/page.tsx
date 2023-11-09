import { Button } from "@/components/Button";
import { CenterContainer } from "@/components/CenterContainer";
import { ShareableLink } from "@/components/ShareableLink";

export default function Page() {

    return (
        <CenterContainer>
            <div className="m-2 text-4xl">
                Give your friend this link:
            </div>
            <div className="m-2">
                <ShareableLink linkTxt="testingalink.com" />
            </div>
        </CenterContainer>
    )
}