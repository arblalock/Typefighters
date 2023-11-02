import { useRouter } from "next/navigation"

interface LinkButtonProps {
    url: string,
    text: string,
}

export const LinkButton = ({ url, text }: LinkButtonProps) => {
    const router = useRouter();
    const handleClick = () => {
        router.push(url)
    }
    return (
        <div className="btn-link" onClick={() => handleClick()}>
            {text}
        </div>
    )
}