"use client"

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { motion, useReducedMotion } from 'framer-motion'
import { Mail, Lock, Loader2, ArrowRight, User } from 'lucide-react'
import { signupSchema } from '@/lib/schemas/signup-schema'
import { signupAction } from '@/app/actions/auth'

export function SignupForm() {
  const router = useRouter()
  const shouldReduceMotion = useReducedMotion()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isPending, startTransition] = useTransition()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
        delayChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  } as const

  const itemVariants = {
    hidden: { y: shouldReduceMotion ? 0 : 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 24,
      },
    },
  } as const

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validate with Zod
    const result = signupSchema.safeParse({ name, email, password, confirmPassword })
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message
        }
      })
      setErrors(fieldErrors)

      // Focus first error field for accessibility
      const firstErrorField = result.error.issues[0]?.path[0]
      if (firstErrorField) {
        setTimeout(() => {
          document.getElementById(firstErrorField.toString())?.focus()
        }, 0)
      }
      return
    }

    // Call signup server action
    startTransition(async () => {
      try {
        const response = await signupAction(name, email, password, confirmPassword)

        if (response?.error) {
          setErrors({ submit: response.error.message })
        } else if (response?.success) {
          // Check if email confirmation is required
          if (response.requiresEmailConfirmation) {
            setErrors({
              submit: response.message || 'Please check your email to confirm your account.'
            })
          } else {
            // Redirect to login page on success
            router.push('/login?signup=success')
          }
        }
      } catch {
        setErrors({ submit: 'An unexpected error occurred. Please try again.' })
      }
    })
  }

  return (
    <motion.form
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Name Field */}
      <motion.div variants={itemVariants} className="space-y-2.5 text-left">
        <Label htmlFor="name" className="text-text-primary font-medium text-sm">Full Name</Label>
        <div className="relative mt-2 isolate">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none z-10">
            <User className="w-5 h-5" aria-hidden="true" />
          </div>
          <Input
            variant="auth"
            id="name"
            type="text"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
            placeholder="John Doe"
            disabled={isPending}
          />
        </div>
        {errors.name && (
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} id="name-error" className="text-xs text-destructive font-medium mt-1.5" role="alert">
            {errors.name}
          </motion.p>
        )}
      </motion.div>

      {/* Email Field */}
      <motion.div variants={itemVariants} className="space-y-2.5 text-left">
        <Label htmlFor="email" className="text-text-primary font-medium text-sm">Email Address</Label>
        <div className="relative mt-2 isolate">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none z-10">
            <Mail className="w-5 h-5" aria-hidden="true" />
          </div>
          <Input
            variant="auth"
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            spellCheck={false}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            placeholder="you@example.com"
            disabled={isPending}
          />
        </div>
        {errors.email && (
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} id="email-error" className="text-xs text-destructive font-medium mt-1.5" role="alert">
            {errors.email}
          </motion.p>
        )}
      </motion.div>

      {/* Password Field */}
      <motion.div variants={itemVariants} className="space-y-2.5 text-left">
        <Label htmlFor="password" className="text-text-primary font-medium text-sm">Password</Label>
        <div className="relative mt-2 isolate">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none z-10">
            <Lock className="w-5 h-5" aria-hidden="true" />
          </div>
          <Input
            variant="auth"
            id="password"
            type="password"
            name="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
            placeholder="••••••••"
            disabled={isPending}
          />
        </div>
        {errors.password && (
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} id="password-error" className="text-xs text-destructive font-medium mt-1.5" role="alert">
            {errors.password}
          </motion.p>
        )}
      </motion.div>

      {/* Confirm Password Field */}
      <motion.div variants={itemVariants} className="space-y-2.5 text-left">
        <Label htmlFor="confirmPassword" className="text-text-primary font-medium text-sm">Confirm Password</Label>
        <div className="relative mt-2 isolate">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none z-10">
            <Lock className="w-5 h-5" aria-hidden="true" />
          </div>
          <Input
            variant="auth"
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
            placeholder="••••••••"
            disabled={isPending}
          />
        </div>
        {errors.confirmPassword && (
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} id="confirmPassword-error" className="text-xs text-destructive font-medium mt-1.5" role="alert">
            {errors.confirmPassword}
          </motion.p>
        )}
      </motion.div>

      {/* Submit Error */}
      {errors.submit && (
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
          className="rounded-lg bg-destructive/10 p-3.5 text-sm font-medium text-destructive text-center border border-destructive/20"
          role="alert"
        >
          {errors.submit}
        </motion.div>
      )}

      {/* Submit Button */}
      <motion.div variants={itemVariants} className="pt-6">
        <Button
          type="submit"
          className="w-full min-h-12 bg-accent-primary hover:bg-accent-primary/90 active:bg-accent-primary/80 text-white text-lg rounded-3xl font-semibold group relative overflow-hidden transition-[background-color,box-shadow] duration-200 shadow-[0_2px_4px_rgba(13,148,136,0.2)] hover:shadow-[0_4px_8px_rgba(13,148,136,0.3)] mt-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface focus-visible:ring-accent-primary focus-visible:outline-none"
          disabled={isPending}
        >
          <span className="flex items-center justify-center gap-2">
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating account…
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </span>
        </Button>
      </motion.div>

      {/* Link to Login */}
      <motion.p variants={itemVariants} className="text-center text-sm text-text-secondary pt-4">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium text-accent-primary hover:text-accent-primary/80 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface focus-visible:ring-accent-primary rounded transition-[color,box-shadow] duration-200"
        >
          Log in
        </Link>
      </motion.p>
    </motion.form>
  )
}
