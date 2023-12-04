import styles from './Loader.module.css'

export const Loader = () => {
    return (
        <div className="m-10">
            <div className="flex item-center justify-center">
                <div className={styles.loader}></div>
            </div>
        </div>

    )
}