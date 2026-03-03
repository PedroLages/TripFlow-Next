"use server"

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function loginAction(
  email: string,
  password: string,
  rememberMe: boolean = false
) {
  const supabase = await createClient()

  // Sign in with Supabase Auth
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return {
      success: false,
      error: {
        code: error.code,
        message: 'Invalid email or password', // Generic message to prevent email enumeration
      },
    }
  }

  // Configure session expiry based on "Remember me"
  const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60 // 30 days or 7 days

  const cookieStore = await cookies()
  cookieStore.set('sb-access-token', data.session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge,
  })

  cookieStore.set('sb-refresh-token', data.session.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge,
  })

  return { success: true }
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()

  const cookieStore = await cookies()
  cookieStore.delete('sb-access-token')
  cookieStore.delete('sb-refresh-token')

  redirect('/login')
}
