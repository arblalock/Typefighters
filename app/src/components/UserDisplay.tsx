import { Button } from "./Button"
import { CenterContainer } from "./CenterContainer"

export const UserDisplay = () => {
    return (
        <CenterContainer margin={0}>
            <Button text="Click when ready" textSize="3xl" buttonStyle="primary" />
        </CenterContainer>
    )
}