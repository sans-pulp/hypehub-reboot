'use server'

import { createClient } from '@/utils/supabase/server'
import { getProfileByEmail } from '@/db/queries/select'

export async function requestPasswordReset(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email')?.toString()

  if (!email) {
    return { error: 'Email is required!' }
  }


  // Check if the user exists in our profiles table
  const profile = await getProfileByEmail(email)
  if (!profile) {
    return { error: 'Email not found' }
  }

  // Send the password reset email
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
  })

  if (error) {
    console.error('Password reset error:', error)
    return { error: error.message }
  }

  return { success: true }
}

export async function resetPassword(formData: FormData) {
  const password = formData.get('password')?.toString()

  if (!password) {
    return { error: 'Password is required!' }
  }

  const supabase = await createClient()

  // Update the user's password
  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    console.error('Password update error:', error)
    return { error: error.message }
  }

  return { success: true }
}
