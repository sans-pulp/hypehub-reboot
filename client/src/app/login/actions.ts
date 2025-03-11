'use server'

import { createClient } from '../../utils/supabase/server'
import { createInitialProfile } from '../../db/queries/insert'
import { getProfileByEmail } from '../../db/queries/select'



export async function register(formData: FormData) {
  const supabase = await createClient()
  // console.log("formData", formData)
  
  const email = formData.get('email')?.toString()
  const password = formData.get('password')?.toString()
  const firstName = formData.get('firstName')?.toString()
  const lastName = formData.get('lastName')?.toString()
  
  if (!email || !password || !firstName || !lastName) {
    return { error: 'Email, password, first name, and last name are required!' }
  }
  // check if profile already exists
  const existingProfile = await getProfileByEmail(email)
  if (existingProfile) {
    return { error: 'Account already exists' }
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if  (authError || !authData.user) {
    return { error: authError?.message || 'Signup failed' }
  }

  try {
    // console.log('Creating profile for new user...')
    await createInitialProfile(email, firstName, lastName)
    // reval
  } catch (error) {
    console.error('Profile creation error:', error)
    // maybe delete auth user if profile creation fails?
    await supabase.auth.admin.deleteUser(authData.user.id)
    return { error: 'Failed to create profile' }
  }

  // revalidatePath('/', 'layout')
  return { success: true }
}

export async function login(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email')?.toString()
  const password = formData.get('password')?.toString()

  
  if (!email || !password) {
    return { error: 'Email and password are required!' }
  }
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (authError || !authData.user) {
    return { error: authError?.message || 'Login failed' }
  }
  
  const profile = await getProfileByEmail(email)
  if (!profile) {
    await supabase.auth.signOut()
    return { error: 'Account not properly set up. User deleted.Please contact support.' }
  }

  // revalidatePath('/', 'layout')
  return { success: true }
}

export const logout = async () => {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Logout error:', error)
  }
  return { success: true }
}






