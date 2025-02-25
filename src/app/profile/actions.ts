'use server'
import { getProfileByEmail } from '@/db/queries/select'

// use this for profile-specific action -- update profile info...
export async function updateProfile(formData: FormData) {
    const email = formData.get('email')?.toString()
    const bio = formData.get('bio')?.toString()
    const firstName = formData.get('firstName')?.toString()
    const lastName = formData.get('lastName')?.toString()

    if (!email ) {
        return { error: 'Email is required!' }
    }
    const profile = await getProfileByEmail(email)
    if (!profile) {
        return { error: 'Profile not found' }
    }


    // update profile bio

    return { success: true }
}

