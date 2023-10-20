import { Button } from "./Button"

export const HomePage = () => {
    //TODO: reference react projects to create global css styles/template
    //Need dark color scheme for background
    //Need default text color
    return (
        <div className="flex m-10 items-center text-center justify-center dark">
            <div className="w-1/2">
                <div className="text-xl-vw">TypeFighters</div>
                {/* <div><Button url="test.com" size="xl" /></div> */}
            </div>

        </div>
    )
}