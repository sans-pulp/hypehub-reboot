'use client'
import { useState, useEffect } from 'react'
import {Goal} from '@/db/schema'
import { completeGoal } from '@/db/queries/update'

type TaskListProps = {
    goals: Goal[],
    profileId: number,
    onTaskComplete: (goalId: number) => void
}
export const TaskList = ({goals, profileId, onTaskComplete}: TaskListProps) => {
    const [loading, setLoading] = useState(false)


    const dailyGoals = goals.filter(goal => goal.type === 'daily' && !goal.isComplete)
    const missionGoals = goals.filter(goal => goal.type === 'mission' && !goal.isComplete)
    const questGoals = goals.filter(goal => goal.type === 'quest' && !goal.isComplete)

    const handleCompleteTask = async (goalId: number) => {}

    return (
        <div className='task-list nes-container h-full w-full is-dark with-title mt-4'>
            <h2 className='title is-primary mb-4 text-xl'>Your Quests</h2>
        </div>
    )
}

const TaskCompletionEffect = () => {
    return (
        <div className='fixed inset-0 flex items-center justify-center bg-blue bg-opacity-50 z-50'>
            <div className='text-center'>
                <i className='nes-icon is-large trophy'></i>
                <p className='nes-text is-success text-xl mt-4'>Task Complete!</p>
            </div>
        </div>
    )
}