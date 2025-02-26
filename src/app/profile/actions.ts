'use server'
import { getProfileByEmail } from '@/db/queries/select'
import { updateProfileById } from '@/db/queries/update' // You'll need to create this function

// Define a return type for consistency
interface ProfileActionResult {
    success?: boolean;
    error?: string;
}

// use this for profile-specific action -- update profile info...
export async function updateProfile(formData: FormData): Promise<ProfileActionResult> {
    const email = formData.get('email')?.toString()
    const bio = formData.get('bio')?.toString()
    const firstName = formData.get('firstName')?.toString()
    const lastName = formData.get('lastName')?.toString()

    if (!email) {
        return { error: 'Email is required!' }
    }
    
    const profile = await getProfileByEmail(email)
    if (!profile) {
        return { error: 'Profile not found' }
    }

    // update profile bio
    try {
        await updateProfileById(profile.id, {
            bio: bio || profile.bio,
            firstName: firstName || profile.firstName,
            lastName: lastName || profile.lastName
        });
        
        return { success: true }
    } catch (error) {
        console.error('Error updating profile:', error);
        return { error: 'Failed to update profile' }
    }
}

