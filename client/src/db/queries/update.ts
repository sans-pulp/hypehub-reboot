'use server'

import { db } from "..";  
import { eq } from "drizzle-orm";
import { goalsTable, attributesTable, type AttributeReward, profilesTable, InsertProfile, Goal } from "../schema";
import { calculateLevelFromXP } from "@/utils/gameUtils";


export const updateGoal = async (goalId: number, updatedData: Partial<Goal>) => {
    console.log('Updating goal', goalId, updatedData);
    try {

        return await db.transaction(async (tx) => {
            // find the goal
            const [goal] = await tx.select().from(goalsTable).where(eq(goalsTable.id, goalId));
            if (!goal) {
                throw new Error('Goal not found');
            }
            
            // update the goal
            const [updatedGoal] = await tx.update(goalsTable).set({
                ...updatedData,
                updatedAt: new Date()
            }).where(eq(goalsTable.id, goalId)).returning();
            
            // return the updated goal
            return updatedGoal;
        });
    } catch (error) {
        console.error('Error updating goal', error);
        throw error;
    }
}

export const completeGoal = async (goalId: number, profileId: number) => {
    return await db.transaction(async (tx) => {
        // Step 1: Find the goal
        const [goal] = await tx.select()
            .from(goalsTable)
            .where(eq(goalsTable.id, goalId));

        if (!goal) {
            throw new Error('Goal not found');
        }

        // Step 2: Mark the goal as complete
        await tx.update(goalsTable)
            .set({ isComplete: true, completedAt: new Date() })
            .where(eq(goalsTable.id, goalId));

        // Step 3: Get current attributes
        const [currentAttributes] = await tx.select()
            .from(attributesTable)
            .where(eq(attributesTable.profileId, profileId));

        // Step 4: Calculate new attribute values
        const newAttributes: Record<AttributeReward['type'] | 'experience', number> = {
            strength: currentAttributes.strength,
            vitality: currentAttributes.vitality,
            knowledge: currentAttributes.knowledge,
            social: currentAttributes.social,
            willpower: currentAttributes.willpower,
            experience: currentAttributes.experience
        };

        // Step 5: Add reward points to attributes
        for (const reward of goal.attributeRewards) {
            // Add points to the specific attribute
            newAttributes[reward.type] += reward.points;
            // Add points to total experience
            newAttributes.experience += reward.points;
        }

        // Step 6: Calculate new level based on total experience
        const newLevel = calculateLevelFromXP(newAttributes.experience);

        // Step 7: Update the database with new values including level
        const [updatedAttributes] = await tx.update(attributesTable)
            .set({
                ...newAttributes,
                level: newLevel
            })
            .where(eq(attributesTable.profileId, profileId))
            .returning();

        return { goal, updatedAttributes };
    });
}

export const updateProfileById = async (id: number, data: Partial<InsertProfile>) => {
    const [profile] = await db.update(profilesTable)
    .set(data)
    .where(eq(profilesTable.id, id))
    .returning()
    return profile
}

export const addExperiencePoints = async (profileId: number, experiencePoints: number, newLevel?: number) => {
    return await db.transaction(async (tx) => {
        // Get current attributes
        const [currentAttributes] = await tx.select()
            .from(attributesTable)
            .where(eq(attributesTable.profileId, profileId));

        // Calculate new experience and level
        const newExperience = currentAttributes.experience + experiencePoints;
        const updatedLevel = newLevel ? newLevel : currentAttributes.level;

        // Update attributes with new experience and level
        const [updatedAttributes] = await tx.update(attributesTable)
            .set({
                experience: newExperience,
                level: updatedLevel
            })
            .where(eq(attributesTable.profileId, profileId))
            .returning();
        
        return updatedAttributes;
    });
}


