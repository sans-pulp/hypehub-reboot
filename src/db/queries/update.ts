'use server'

import { db } from "@/db";  
import { eq, sql } from "drizzle-orm";
import { goalsTable, attributesTable, type AttributeReward, profilesTable, InsertProfile } from "@/db/schema";

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
            .set({ isComplete: true })
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

        // Step 6: Update the database with new values
        const [updatedAttributes] = await tx.update(attributesTable)
            .set(newAttributes)
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

export const addExperiencePoints = async (profileId: number, points: number) => {
    const [updatedAttributes] = await db.update(attributesTable)
        .set({
            experience: sql`${attributesTable.experience} + ${points}`
        })
        .where(eq(attributesTable.profileId, profileId))
        .returning();
    
    return updatedAttributes;
}


