import { Loader } from "./Loader"

type StatusLoadProps = {
    statusTxt: string;
}

export const StatusLoader = ({ statusTxt }: StatusLoadProps) => {
    return (
        <div className="flex-col item-center justify-center">
            <Loader />
            <div className="text-2xl m-2 mb-8 cl-blue-3">{statusTxt}</div>
        </div>
    )
}




