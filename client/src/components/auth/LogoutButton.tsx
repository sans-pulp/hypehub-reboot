'use client'
import { logout } from "@/app/login/actions"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export const LogoutButton = ({errorCallback}:{errorCallback: () => void}) => {
    const router = useRouter()
    const handleLogout = async () => {
        const result = await logout()
        if (result.success) {
            router.push('/')
        } else {
            errorCallback()
        }
    }
    
    return (
        <Button onClick={handleLogout} variant="destructive" className="font-pixel text-sm">Logout</Button>
    )
    
}   