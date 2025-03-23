'use server'
import { insertGoal } from '../../db/queries/insert'
import { InsertGoal } from '../../db/schema'
import { ATTRIBUTE_POINTS_LIMITS } from '@/components/ui/constants'

// goal creation action
export const createGoal = async(goal: InsertGoal) => {
    try {
        // Validate attribute points
        const limits = ATTRIBUTE_POINTS_LIMITS[goal.type.toLowerCase() as keyof typeof ATTRIBUTE_POINTS_LIMITS];
        
        const invalidRewards = goal.attributeRewards.some(reward => 
            reward.points < limits.min || reward.points > limits.max
        );

        if (invalidRewards) {
            throw new Error(`Invalid attribute points for goal type ${goal.type}. Points must be between ${limits.min} and ${limits.max}`);
        }

        const newGoal = await insertGoal(goal)
        return newGoal
    } catch (error) {
        console.error('Error creating goal:', error)
        throw error
    }
}

// goal completion action


// experience points action
