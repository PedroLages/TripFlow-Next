"use client"

import { motion } from 'framer-motion'
import { Users, Lock, CheckCircle } from 'lucide-react'
import { formatBudgetAmount } from '@/lib/blind-budget'

interface GroupLimitDisplayProps {
  groupLimitCents: number | null
  budgetCount: number
  memberCount: number
  currencyCode: string
  allReady: boolean
}

export function GroupLimitDisplay({
  groupLimitCents,
  budgetCount,
  memberCount,
  currencyCode,
  allReady,
}: GroupLimitDisplayProps) {
  const progress = memberCount > 0 ? (budgetCount / memberCount) * 100 : 0

  if (budgetCount === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl p-6 text-center" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
        <Users size={24} style={{ color: 'var(--text-secondary)' }} />
        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          Waiting for members to set their budgets
        </p>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          0 of {memberCount} members ready
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-xl p-5" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={16} style={{ color: 'var(--text-secondary)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Group Affordable Limit</span>
          </div>
          {allReady && (
            <span className="flex items-center gap-1 text-xs font-medium text-teal">
              <CheckCircle size={12} /> All set
            </span>
          )}
        </div>

        {groupLimitCents !== null ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-3xl font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            {formatBudgetAmount(groupLimitCents, currencyCode)}
          </motion.div>
        ) : (
          <div className="text-lg" style={{ color: 'var(--text-secondary)' }}>Calculating...</div>
        )}

        <div className="flex flex-col gap-1.5">
          <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: 'var(--bg-surface-hover)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'var(--accent-primary)' }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <Lock size={10} />
            {budgetCount} of {memberCount} members set their budget
          </div>
        </div>
      </div>
    </div>
  )
}
