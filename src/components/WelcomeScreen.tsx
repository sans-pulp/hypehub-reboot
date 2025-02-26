'use client'
import LoginPage from '@/app/login/page'

export const WelcomeScreen = () => {
    return (
        <div className="flex justify-center items-center min-h-screen p-4">
            <div className="nes-container is-dark with-title h-120 w-9/12 !border-2 !border-[#209cee]">
                <h1 className="title">Welcome to HypeHub</h1>
                <LoginPage />
            </div>
        </div>
    )
}