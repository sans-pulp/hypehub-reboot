import { db } from "..";  
import { attributesTable, goalsTable, profilesTable,  InsertGoal, InsertProfile } from "../schema";

export const insertGoal = async (data: InsertGoal) => {
    const [goal] = await db.insert(goalsTable).values(data).returning()
    return goal
}

export const insertProfile = async (data: InsertProfile) => {
    // make sure profile_id is added to the data object...
    const [profile] = await db.insert(profilesTable).values(data).returning()
    return profile
}

export const createInitialProfile = async (email: string, firstName: string, lastName: string) => {
    return await db.transaction(async (tx) => {
        // create profile
        const [profile] = await tx.insert(profilesTable)
        .values({
            firstName,
            lastName,
            userEmail: email,
            createdAt: new Date(),
            updatedAt: new Date(),
        })
        .returning()

        // create initial attributes

        const [attributes] = await tx.insert(attributesTable)
        .values({
            name: `${firstName}'s Attributes`,
            profileId: profile.id,
            createdAt: new Date(),
            updatedAt: new Date(),
        })
        .returning()

        return { profile, attributes }
    })
}

