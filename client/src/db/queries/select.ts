'use server'

import { db } from "..";  
import { goalsTable, profilesTable, attributesTable } from "../schema";
import { eq } from "drizzle-orm";

export const getGoalsByProfileId = async (id: number) => {
    const goals = await db.select()
    .from(goalsTable)
    .where(eq(goalsTable.profileId, id))
    return goals
}

export const getProfileById = async (id: number) => {
    const [profile] = await db.select()
    .from(profilesTable)
    .where(eq(profilesTable.id, id))
    return profile
}

export const getProfileByEmail = async (email: string) => {
    const [profile] = await db.select()
    .from(profilesTable)
    .where(eq(profilesTable.userEmail, email))
    return profile
}

export const getAttributesByProfileId = async (id: number) => {
    const [attributes] = await db.select()
    .from(attributesTable)
    .where(eq(attributesTable.profileId, id))
    return attributes
}
