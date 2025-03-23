'use server'
import { getProfileById } from '@/db/queries/select'
import { updateProfileById } from '@/db/queries/update' 
import { createClient } from '@/utils/supabase/server'

// Define a return type for consistency
interface ProfileActionResult {
    success?: boolean;
    error?: string;
    data?: { path: string };
}

// Delete old avatar for a profile
const deleteExistingAvatar = async (oldAvatarUrl: string) => {
    const supabase = await createClient()
    if (!oldAvatarUrl) return;
    console.log('deleting avatar', oldAvatarUrl)
    const path = oldAvatarUrl.split(`${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME}/`)[1];
     const { error } = await supabase.storage
        .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME!)
        .remove([path]);
    if (error) {
        console.error('Error deleting avatar:', error);
    }    
}
// Upload an avatar for a profile
export async function uploadAvatar(file: File, profileId: number): Promise<ProfileActionResult> {
    const supabase = await createClient()

    // get current profile by id
    const profile = await getProfileById(profileId)
    if (!profile) {
        return { error: 'Profile not found' }
    }
    
    const allowedTypes = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/gif': 'gif'
    } as const;

    // Check if the file type is allowed
    if (!(file.type in allowedTypes)) {
        return { error: 'Please upload a JPG, PNG, WebP, or GIF file' };
    }

    // Use auth user's ID in the path to comply with RLS
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email) {
        return { error: 'Not authenticated' }
    }

    const fileExtension = allowedTypes[file.type as keyof typeof allowedTypes];
    // Generate a unique file name
    const fileName = `${crypto.randomUUID().slice(0, 8)}.${fileExtension}`
    // Create a path for the file
    const filePath = `avatars/${user.id}/${fileName}`
    // Create file options
    const fileOptions = { contentType: file.type }
    // Upload the file
    const { error } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME!)
    .upload(filePath, file, fileOptions)

    if (error) {
        console.error('Error uploading file:', error);
        return {error: error.message}
    } 

    // Get public url
    const { data: { publicUrl } } = supabase.storage
    .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME!)
    .getPublicUrl(filePath)
    
    // Delete old avatar if it exists
    if (profile.avatarUrl) {
        await deleteExistingAvatar(profile.avatarUrl)
    }

    return { data: { path: publicUrl } }
}



// use this for profile-specific action -- update profile info...
export async function updateProfile(profileId: number, formData: FormData): Promise<ProfileActionResult> {

    const email = formData.get('email')?.toString()
    const bio = formData.get('bio')?.toString()
    const firstName = formData.get('firstName')?.toString()
    const lastName = formData.get('lastName')?.toString()
    const avatarUrl = formData.get('avatarUrl')?.toString()
    if (!email) {
        return { error: 'Email is required!' }
    }
    
    const profile = await getProfileById(profileId)
    if (!profile) {
        return { error: 'Profile not found' }
    }

    // update profile bio
    try {
        await updateProfileById(profileId, {
            bio: bio || profile.bio,
            firstName: firstName || profile.firstName,
            lastName: lastName || profile.lastName,
            avatarUrl: avatarUrl || profile.avatarUrl,
            userEmail: email
        });
        
        return { success: true }
    } catch (error) {
        console.error('Error updating profile:', error);
        return { error: 'Failed to update profile' }
    }
}

