import { Loader } from "./Loader"

type StatusLoadProps = {
    statusTxt: string;
    loaderMargin?: number
    statusTxtMargin?: number
}

export const StatusLoader = ({ statusTxt, loaderMargin = 2.5, statusTxtMargin = 0.5 }: StatusLoadProps) => {
    return (
        <div className="flex-col item-center justify-center">
            <Loader margin={loaderMargin} />
            <div
                style={{ margin: `${statusTxtMargin}rem` }}
                className="text-2xl mb-8 cl-blue-3">{statusTxt}
            </div>
        </div>
    )
}




