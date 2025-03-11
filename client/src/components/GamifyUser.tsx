'use client'
import type { Profile, Attribute } from '@/db/schema'

export const GamifyUser = ({userProfile, userAttributes}: {userProfile: Profile | null, userAttributes: Attribute | null}) => {
  
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
                    <p className="nes-text is-success">Exp: {userAttributes?.experience}</p>
                    <div className='progress-bar'>
                        <progress className='nes-progress is-pattern' value={userAttributes?.experience} max={(userAttributes ? (userAttributes?.level * 100) : 100).toString()}></progress>
                    </div>
                </div>

            </div>
            </div>
        </div>
    );
};


