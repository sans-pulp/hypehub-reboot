'use client'
import { useState, useEffect } from 'react'

export const LoadingScreen = () => {
    const [progress, setProgress] = useState(0)
    const [messageIndex, setMessageIndex] = useState(0)

    const loadingText = [
        'Summoning your quests...',
        'Gathering your stats...',
        'Analyzing your progress...',
        'Crafting your rewards...',
        'Preparing your journey...',
        'Getting ready for adventure...',
        'Getting Hype!!!!!!'
    ]
    
    useEffect(() => {
        // animate loading text
        const messageInterval = setInterval(() => {
            setMessageIndex(prev => {
                if (prev < loadingText.length - 1) {
                    return prev + 1;
                }
                return prev;
            });
        }, 2000 / loadingText.length)

        // animate progress bar from 0 to 100
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval)
                    return 100
                }
                return prev + 1
            })
        }, 20)

        return () => {
            clearInterval(messageInterval)
            clearInterval(progressInterval)
        }
    }, [])

    return (
        <div className="flex justify-center items-center min-h-screen p-4">
            <div className="nes-container is-dark with-title h-120 w-9/12 !border-2 !border-[#209cee]">
                <h1 className="title">{loadingText[messageIndex]}</h1>
                {progress < 99 && <progress className="nes-progress is-pattern" value={progress} max="100"></progress>}
                {progress >= 99 && <progress className="nes-progress is-primary" value={progress} max="100"></progress>}
            </div>
        </div>
    )
}
