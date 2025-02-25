import { db } from "@/db";  
import { eq } from "drizzle-orm";
import { goalsTable, profilesTable, attributesTable } from "@/db/schema";
import { createClient } from "@/utils/supabase/server";

export async function deleteUser(email: string) {
    // Get the Supabase user ID first
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser()
    console.log('userData', userData)
    
    if (!userData?.user) {
        throw new Error('Auth user not found');
    }

    // Verify the email matches
    if (userData.user.email !== email) {
        throw new Error('Email mismatch: Cannot delete a different user');
    }
    
    const userId = userData.user.id;
    
    // Delete database records in a transaction
    try {
    await db.transaction(async (tx) => {
        // Find the profile
        const [profile] = await tx.select()
            .from(profilesTable)
            .where(eq(profilesTable.userEmail, email));
            
        if (!profile) {
            throw new Error('Profile not found');
        }
        
        // Delete attributes associated with the profile
        await tx.delete(attributesTable)
            .where(eq(attributesTable.profileId, profile.id));
        
        // Delete goals associated with the profile
        await tx.delete(goalsTable)
            .where(eq(goalsTable.profileId, profile.id));
        
        // Delete the profile
        await tx.delete(profilesTable)
            .where(eq(profilesTable.id, profile.id));
    });
    
    // Delete the auth user -- need to check supabase for setting up admin privileges in dev/prod
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) {
        throw new Error(`Warning:Failed to delete auth user - ${error.message}`);
    }
    
    
    return { success: true };
} catch (error) {
    console.error('Error deleting user:', error);
    throw error;
}
};
