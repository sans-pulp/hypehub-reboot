'use client'
import { useState, useEffect } from 'react'
import { getCurrentUserData } from '@/utils/auth'
import type { Profile, Attribute, Goal } from '@/db/schema'
import { GamifyUser } from '@/components/GamifyUser'
import { LoadingScreen } from '@/components/LoadingScreen'
import { GoalListContainer } from '@/components/GoalList'
import { GoalCreationForm } from '@/components/goal-creation/GoalCreationForm'

export const GameInterface = () => {
    //modals for profile updates - CRUD
    // modal for settings? -- maybe theme, language, music, etc.
    // modal for notifications? -- maybe for when a user completes a goal, or when a user completes a task, or when a user completes a challenge, or when a user completes a quest, or when a user completes a milestone, or when a user completes a level, 
    // what's on this page? - character/profile info, tasks - daily, mission, quests, progress bars, battle theme music
    const [userProfile, setUserProfile] = useState<Profile | null>(null);
    const [userAttributes, setUserAttributes] = useState<Attribute | null>(null);
    const [userGoals, setUserGoals] = useState<Goal[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { profile, attributes, goals } = await getCurrentUserData()
                setUserProfile(profile)
                setUserAttributes(attributes)
                setUserGoals(goals)
            } catch (error) {
                console.error('Error fetching user:', error)
            }
            finally {
                const minLoadingTime = 2000
                const loadingStartTime = Date.now()
                const timeElapsed = Date.now() - loadingStartTime
                if (timeElapsed < minLoadingTime) {
                    setTimeout(() => {
                        setLoading(false)
                    }, minLoadingTime - timeElapsed)
                } else {
                    setLoading(false)
                }
            }
        }

        fetchUser()
    }, [])

    if (loading) {
        return <LoadingScreen />
    }

return (
    <div className='game-world nes-container h-screen w-screen is-dark with-title !m-0'>
        <h1 className='title'>HypeHub</h1>
        <GamifyUser userProfile={userProfile} userAttributes={userAttributes} />
        <GoalListContainer goals={userGoals || []} profileId={userProfile?.id || 0} onGoalComplete={() => {}} />
        <GoalCreationForm profileId={userProfile!.id} />
    </div>
)
}






