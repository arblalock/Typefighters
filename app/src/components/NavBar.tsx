'use client'
import { usePathname } from "next/navigation"
import { LinkButton } from "./LinkButton"


export const NavBar = () => {
    const pathName = usePathname();
    const isHome = pathName === '/'
    return (
        !isHome && <div className="flex flex-row items-center h-14 dark-bg-2">
            <div className="text-xl mx-5 my-2">
                <LinkButton url="/" text="TypeFighters" />
            </div>
        </div>
    )
}