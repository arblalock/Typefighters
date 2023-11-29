import styles from './Loader.module.css'

export const Loader = () => {
    return (
        <div className="flex item-center justify-center">
            <div className={styles.loader}></div>
        </div>
    )
}