import styles from './Loader.module.css'

type LoaderProps = {
    margin?: number
}

export const Loader = ({ margin = 2.5 }: LoaderProps) => {
    return (
        <div style={{
            margin: `${margin}rem`,
        }}>
            <div className="flex item-center justify-center">
                <div className={styles.loader}></div>
            </div>
        </div>

    )
}