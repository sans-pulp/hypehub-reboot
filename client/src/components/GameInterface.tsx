'use client'
import { useState, useEffect, useCallback } from 'react'
import { getCurrentUserData } from '@/utils/auth'
import type { Profile, Attribute, Goal } from '@/db/schema'
import { GamifyUser } from '@/components/GamifyUser'
import { LoadingScreen } from '@/components/LoadingScreen'
import { GoalListContainer } from '@/components/GoalList'
import { GoalCreationForm } from '@/components/goal-creation/GoalCreationForm'
import { useWebSocket } from '@/hooks/useWebsocket'

export const GameInterface = () => {
    //modals for profile updates - CRUD
    // modal for settings? -- maybe theme, language, music, etc.
    // modal for notifications? -- maybe for when a user completes a goal, or when a user completes a task, or when a user completes a challenge, or when a user completes a quest, or when a user completes a milestone, or when a user completes a level, 
    // what's on this page? - character/profile info, tasks - daily, mission, quests, progress bars, battle theme music
    const [userProfile, setUserProfile] = useState<Profile | null>(null);
    const [userAttributes, setUserAttributes] = useState<Attribute | null>(null);
    const [userGoals, setUserGoals] = useState<Goal[] | null>(null);
    const [loading, setLoading] = useState(true);
    const {isConnected, events, sendHypeHubEvent} = useWebSocket('ws://localhost:8080')


    // Handle incoming WebSocket events
    useEffect(() => {
        if (!events?.length) return; // Guard against empty events array
        
        const latestEvent = events[events.length - 1];
        // Guard against undefined event and ensure it matches HypeHubEvents type
        if (!latestEvent?.type || !latestEvent?.payload) {
            console.warn('Received malformed event:', latestEvent);
            return;
        }

        switch (latestEvent.type) {
            case 'SYSTEM':
                console.log("System message:", latestEvent.payload);
                break;
            case 'LEVEL_UP':
                console.log("Level up event received", latestEvent.payload);
                // setUserAttributes((prev) => prev ? {
                //     ...prev,
                //     ...latestEvent.payload
                // } : null);
                break;
            case 'ACHIEVEMENT':
                console.log("Achievement event received", latestEvent.payload);
                break;
            case 'GOAL_COMPLETED':
                console.log("Goal completed event received", latestEvent.payload);
                break;
            case 'CHAT_MESSAGE':
                console.log("Chat message received", latestEvent.payload);
                break;
            default:
                console.warn('Unknown event type:', latestEvent.type);
        }
    }, [events]);

    // Fetch initial user data
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
        
        {/* Add connection status and test button */}
        <div className="nes-container is-rounded">
            <p>WebSocket Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</p>
            <button 
                className="nes-btn is-primary" 
                onClick={() => {
                    console.log('Sending test message...');
                    sendHypeHubEvent({
                        type: 'SYSTEM',
                        payload: { message: 'Test message from client', timestamp: new Date().toISOString() }
                    });
                }}
            >
                Send Test Message
            </button>
        </div>

        <GamifyUser 
            userProfile={userProfile} 
            userAttributes={userAttributes} 
            onLevelUp={(newLevel) => {
                sendHypeHubEvent({
                    type: 'LEVEL_UP',
                    payload: { id: userProfile?.id, level: newLevel }
                })
            }} 
        />
        <GoalListContainer goals={userGoals || []} profileId={userProfile?.id || 0} onGoalComplete={(goalId) => {
            sendHypeHubEvent({
                type: 'GOAL_COMPLETED',
                payload: { userId: userProfile?.id, goalId }
            })
        }} />
        <GoalCreationForm profileId={userProfile!.id} />
    </div>
)
}






