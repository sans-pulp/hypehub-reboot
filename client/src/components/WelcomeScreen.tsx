'use client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const WelcomeScreen = () => {
    return (
        <div className="flex justify-center items-center min-h-screen p-4">
            <div className="nes-container is-dark with-title h-120 w-9/12 !border-2 !border-[#209cee]">
                <h1 className="title">Welcome to HypeHub</h1>
                
                <div className="flex flex-col items-center space-y-6 py-8">
                    <div className="text-center space-y-4 max-w-2xl">
                        <h2 className="text-xl mb-4">Level Up Your Productivity!</h2>
                        <p className="mb-4">
                            HypeHub turns your daily tasks into an exciting adventure. 
                            Complete goals, gain experience, and watch your character grow!
                        </p>
                        <p className="mb-6">
                            Join our community of productivity warriors and start your journey today.
                        </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 mt-6">
                        <Button asChild className="px-8 py-2">
                            <Link href="/login">Login</Link>
                        </Button>
                        <Button asChild variant="secondary" className="px-8 py-2">
                            <Link href="/register">Register</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
