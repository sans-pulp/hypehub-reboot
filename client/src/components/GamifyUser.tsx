'use client'
import { useEffect } from 'react'
import type { Profile, Attribute } from '@/db/schema'
import { calculateLevelFromXP, calculateLevelProgress, calculateRequiredXP } from '@/utils/gameUtils'

export const GamifyUser = ({userProfile, userAttributes, onLevelUp}: {userProfile: Profile | null, userAttributes: Attribute | null, onLevelUp: (newLevel: number) => void}) => {
    // Check for level ups whenever experience changes
    useEffect(() => {
        if (!userAttributes) return;
        
        const newLevel = calculateLevelFromXP(userAttributes.experience);
        if (newLevel > userAttributes.level) {
            onLevelUp(newLevel);
        }
    }, [userAttributes, onLevelUp]);

    // Calculate current progress
    const progress = userAttributes ? calculateLevelProgress(userAttributes.experience) : 0;
    const nextLevelXP = userAttributes ? calculateRequiredXP(userAttributes.level + 1) : 100;

    return (
        <div className="flex flex-row items-center justify-center mt-5 mb-5">
            <div className="nes-container h-fit w-fit !border-2 !border-[#209cee]">
                <div className='flex flex-row align-items-center items-center gap-4'>
                    <div className="avatar">
                        <i className="nes-pokeball"></i>
                    </div>
                    <div className="user-info">
                        <h1 className="first-name">{userProfile?.firstName || 'Guest'}</h1>
                        <p className="nes-text is-success">Level: {userAttributes?.level}</p>
                        <p className="nes-text is-success">
                            XP: {userAttributes?.experience} / {nextLevelXP}
                        </p>
                        <div className='progress-bar'>
                            <progress 
                                className='nes-progress is-pattern' 
                                value={progress} 
                                max="100"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


