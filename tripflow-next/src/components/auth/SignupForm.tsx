"use client"

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { Mail, Lock, Loader2, ArrowRight, User } from 'lucide-react'
import { signupSchema } from '@/lib/schemas/signup-schema'
import { signupAction } from '@/app/actions/auth'
import './SignupForm.css'

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
      className="signup-form"
    >
      {/* Name Field */}
      <motion.div variants={itemVariants} className="field-container">
        <label htmlFor="name" className="field-label">Full Name</label>
        <div className="input-wrapper">
          <div className="input-icon">
            <User aria-hidden="true" />
          </div>
          <input
            className="auth-input"
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
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            id="name-error"
            className="error-message"
            role="alert"
          >
            {errors.name}
          </motion.p>
        )}
      </motion.div>

      {/* Email Field */}
      <motion.div variants={itemVariants} className="field-container">
        <label htmlFor="email" className="field-label">Email Address</label>
        <div className="input-wrapper">
          <div className="input-icon">
            <Mail aria-hidden="true" />
          </div>
          <input
            className="auth-input"
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
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            id="email-error"
            className="error-message"
            role="alert"
          >
            {errors.email}
          </motion.p>
        )}
      </motion.div>

      {/* Password Field */}
      <motion.div variants={itemVariants} className="field-container">
        <label htmlFor="password" className="field-label">Password</label>
        <div className="input-wrapper">
          <div className="input-icon">
            <Lock aria-hidden="true" />
          </div>
          <input
            className="auth-input"
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
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            id="password-error"
            className="error-message"
            role="alert"
          >
            {errors.password}
          </motion.p>
        )}
      </motion.div>

      {/* Confirm Password Field */}
      <motion.div variants={itemVariants} className="field-container">
        <label htmlFor="confirmPassword" className="field-label">Confirm Password</label>
        <div className="input-wrapper">
          <div className="input-icon">
            <Lock aria-hidden="true" />
          </div>
          <input
            className="auth-input"
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
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            id="confirmPassword-error"
            className="error-message"
            role="alert"
          >
            {errors.confirmPassword}
          </motion.p>
        )}
      </motion.div>

      {/* Submit Error */}
      {errors.submit && (
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
          className="server-error"
          role="alert"
        >
          {errors.submit}
        </motion.div>
      )}

      {/* Submit Button */}
      <motion.div variants={itemVariants} className="submit-button-container">
        <button
          type="submit"
          className="submit-button"
          disabled={isPending}
        >
          <span className="button-content">
            {isPending ? (
              <>
                <Loader2 className="button-icon spinning" />
                Creating account…
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="button-icon arrow" />
              </>
            )}
          </span>
        </button>
      </motion.div>

      {/* Link to Login */}
      <motion.p variants={itemVariants} className="login-link-container">
        Already have an account?{' '}
        <Link href="/login" className="login-link">
          Log in
        </Link>
      </motion.p>
    </motion.form>
  )
}
