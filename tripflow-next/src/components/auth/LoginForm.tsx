"use client"

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { loginSchema, type LoginFormData } from '@/lib/schemas/login-schema'
import { loginAction } from '@/app/actions/auth'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validate with Zod
    const result = loginSchema.safeParse({ email, password, rememberMe })
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    // Call server action
    startTransition(async () => {
      try {
        const response = await loginAction(email, password, rememberMe)
        if (response?.error) {
          setErrors({ submit: response.error.message })
        } else if (response?.success) {
          // Redirect to dashboard on success
          router.push('/dashboard')
        }
      } catch (error) {
        setErrors({ submit: 'An unexpected error occurred. Please try again.' })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          placeholder="you@example.com"
          disabled={isPending}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-destructive" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'password-error' : undefined}
          placeholder="••••••••"
          disabled={isPending}
        />
        {errors.password && (
          <p id="password-error" className="text-sm text-destructive" role="alert">
            {errors.password}
          </p>
        )}
      </div>

      {/* Remember Me Checkbox */}
      <div className="flex items-center justify-between">
        <Checkbox
          id="rememberMe"
          label="Remember me"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          disabled={isPending}
        />
        <Link
          href="/forgot-password"
          className="text-sm text-accent-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          Forgot password?
        </Link>
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div
          className="rounded-md bg-destructive/10 p-3 text-sm text-destructive"
          role="alert"
        >
          {errors.submit}
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={isPending}
      >
        {isPending ? 'Logging in...' : 'Log in'}
      </Button>

      {/* Link to Registration */}
      <p className="text-center text-sm text-text-secondary">
        Don't have an account?{' '}
        <Link
          href="/register"
          className="text-accent-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          Sign up
        </Link>
      </p>
    </form>
  )
}
