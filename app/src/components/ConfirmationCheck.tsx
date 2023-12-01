import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'

export const ConfirmationCheck = () => {
    return (
        <div className="ani-fadeIn ani-scale-elastic text-8xl">
            <FontAwesomeIcon icon={faCircleCheck} />
        </div>
    )
}