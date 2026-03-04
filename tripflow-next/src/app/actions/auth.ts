"use server"

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { loginSchema } from '@/lib/schemas/login-schema'
import { signupSchema } from '@/lib/schemas/signup-schema'

/**
 * Server action for user login (FormData version for form action attribute)
 *
 * This version receives FormData from a form with action={loginAction}.
 * Using the action attribute (instead of onSubmit) allows redirect() to work properly.
 */
export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const rememberMe = formData.get('rememberMe') === 'on'

  // Validate inputs with Zod schema
  const parsed = loginSchema.safeParse({ email, password, rememberMe })

  if (!parsed.success) {
    // For form actions, we can't return errors easily, so redirect to login with error state
    redirect('/login?error=validation')
  }

  const supabase = await createClient()

  // Sign in with Supabase Auth using validated data
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    // Redirect back to login with error indicator
    redirect('/login?error=auth')
  }

  // Revalidate all routes to pick up new session
  revalidatePath('/', 'layout')

  // Redirect to home page - this works properly when called from form action
  redirect('/')
}

/**
 * Server action for user signup
 *
 * @param name - User's full name
 * @param email - User email address
 * @param password - User password
 * @param confirmPassword - Password confirmation
 */
export async function signupAction(
  name: string,
  email: string,
  password: string,
  confirmPassword: string
) {
  // Validate inputs with Zod schema
  const parsed = signupSchema.safeParse({ name, email, password, confirmPassword })

  if (!parsed.success) {
    return {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: parsed.error.issues[0]?.message || 'Invalid input',
      },
    }
  }

  const supabase = await createClient()

  // Sign up with Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.name,
      },
    },
  })

  if (error) {
    return {
      success: false,
      error: {
        code: error.code || 'SIGNUP_ERROR',
        message: error.message || 'Failed to create account. Please try again.',
      },
    }
  }

  // Check if email confirmation is required
  if (data.user && !data.user.confirmed_at) {
    return {
      success: true,
      requiresEmailConfirmation: true,
      message: 'Please check your email to confirm your account.',
    }
  }

  return { success: true }
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()

  redirect('/login')
}
