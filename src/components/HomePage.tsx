"use client"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const useUser = () => ({ user: 'test', loading: false })

export const HomePage = () => {
    const { user, loading } = useUser()
    const router = useRouter();

    useEffect(() => {
        //Using test user for now
        if (user && loading === false) {
            router.push('/dashboard')
        }
    }, [user])

    return (
        <div>
            loading...
        </div>
    )
}