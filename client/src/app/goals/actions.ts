'use server'
import { insertGoal } from '../../db/queries/insert'
import {InsertGoal} from '../../db/schema'
// goal creation action
export const createGoal = async(goal: InsertGoal) => {
    try {
    const newGoal = await insertGoal(goal)
    return newGoal
    } catch (error) {
        console.error('Error creating goal:', error)
        throw error
    }
}

// goal completion action


// experience points action