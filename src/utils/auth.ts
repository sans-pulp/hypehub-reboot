'use server'
import { createClient } from '@/utils/supabase/server'
import { getProfileByEmail } from '@/db/queries/select'
import { getAttributesByProfileId, getGoalsByProfileId } from '@/db/queries/select'

// Get the current user's profile
export async function getCurrentUserProfile() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user?.email) {
        return null
    }

    return await getProfileByEmail(user.email)
}

// Get the current user's attributes
export async function getCurrentUserAttributes() {
    const profile = await getCurrentUserProfile()
    
    if (!profile) {
        return null
    }
    
    return await getAttributesByProfileId(profile.id)
}

// Get the current user's goals
export async function getCurrentUserGoals() {
    const profile = await getCurrentUserProfile()
    
    if (!profile) {
        return null
    }
    
    return await getGoalsByProfileId(profile.id)
}

// Get complete user data (profile, attributes, goals)
export async function getCurrentUserData() {
    const profile = await getCurrentUserProfile()
    
    if (!profile) {
        return { profile: null, attributes: null, goals: null }
    }
    
    const [attributes, goals] = await Promise.all([
        getAttributesByProfileId(profile.id),
        getGoalsByProfileId(profile.id)
    ])
    
    return { profile, attributes, goals }
}
