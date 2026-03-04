"use client"

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
} as const

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
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

export function LoginForm() {
  const router = useRouter()
  /**
   * "Remember Me" checkbox state (UX pattern only)
   *
   * NOTE: The actual session duration is controlled by the Supabase project's
   * JWT expiry setting (currently 30 days). This checkbox exists to meet user
   * expectations but does not affect session behavior.
   *
   * @see https://github.com/supabase/auth-js/issues/281
   * @see docs/implementation-artifacts/1-2-user-login-with-session-management.md
   */
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          body: formData,
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || 'An error occurred')
          return
        }

        // Success! Refresh router and redirect to dashboard
        router.refresh()
        router.push('/dashboard')
      } catch (err) {
        setError('An unexpected error occurred')
      }
    })
  }

  return (
    <motion.form
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      method="post"
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Email Field */}
      <motion.div variants={itemVariants} className="space-y-2.5">
        <Label htmlFor="email" className="text-foreground font-medium text-sm">Email Address</Label>
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/70 pointer-events-none z-10">
            <Mail className="w-4 h-4" />
          </div>
          <Input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            className="pl-11 bg-white/95 dark:bg-white/10 border-input/60 hover:border-primary/30 focus-visible:border-primary transition-all duration-200"
          />
        </div>
      </motion.div>

      {/* Password Field */}
      <motion.div variants={itemVariants} className="space-y-2.5">
        <Label htmlFor="password" className="text-foreground font-medium text-sm">Password</Label>
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/70 pointer-events-none z-10">
            <Lock className="w-4 h-4" />
          </div>
          <Input
            id="password"
            type="password"
            name="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className="pl-11 bg-white/95 dark:bg-white/10 border-input/60 hover:border-primary/30 focus-visible:border-primary transition-all duration-200"
          />
        </div>
      </motion.div>

      {/* Remember Me Checkbox */}
      <motion.div variants={itemVariants} className="flex items-center justify-between pt-2">
        <Checkbox
          id="rememberMe"
          name="rememberMe"
          label="Remember me"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        <Link
          href="/forgot-password"
          className="text-sm font-medium text-primary hover:text-primary/80 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded transition-colors"
        >
          Forgot password?
        </Link>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-lg bg-destructive/10 p-3.5 text-sm font-medium text-destructive text-center border border-destructive/20"
          role="alert"
        >
          {error}
        </motion.div>
      )}

      {/* Submit Button */}
      <motion.div variants={itemVariants} className="pt-4">
        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 group"
        >
          <span className="flex items-center justify-center gap-2.5">
            <span>{isPending ? 'Logging in...' : 'Log in'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </Button>
      </motion.div>

      {/* Link to Registration */}
      <motion.p variants={itemVariants} className="text-center text-sm text-foreground/80 pt-4">
        Don&apos;t have an account?{' '}
        <Link
          href="/signup"
          className="font-medium text-primary hover:text-primary/80 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded transition-all"
        >
          Sign up
        </Link>
      </motion.p>
    </motion.form>
  )
}
