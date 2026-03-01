"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Check, Pencil } from 'lucide-react'
import { PrivacyIndicator } from './PrivacyIndicator'
import { centsToDollars, dollarsToCents, formatBudgetAmount } from '@/lib/blind-budget'

interface BlindBudgetFormProps {
  currentAmountCents: number | null
  currencyCode: string
  isPending: boolean
  isSettingGroupMin: boolean
  onSubmit: (amountCents: number) => void
}

export function BlindBudgetForm({
  currentAmountCents,
  currencyCode,
  isPending,
  isSettingGroupMin,
  onSubmit,
}: BlindBudgetFormProps) {
  const hasExisting = currentAmountCents !== null
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const handleEdit = () => {
    setInputValue(hasExisting ? String(centsToDollars(currentAmountCents)) : '')
    setIsEditing(true)
  }

  const handleSave = () => {
    const dollars = parseFloat(inputValue)
    if (isNaN(dollars) || dollars < 0) return
    if (dollars > 100000) return
    onSubmit(dollarsToCents(dollars))
    setIsEditing(false)
  }

  // Locked display state — show when user has a budget and isn't editing
  if (hasExisting && !isEditing) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock size={16} className="text-teal" />
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Your Private Budget</span>
          </div>
          <PrivacyIndicator />
        </div>

        <div className="flex items-center justify-between rounded-xl p-4" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
          <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {formatBudgetAmount(currentAmountCents, currencyCode)}
          </span>
          <button
            onClick={handleEdit}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-teal/10 text-teal"
          >
            <Pencil size={14} /> Edit
          </button>
        </div>

        {isSettingGroupMin && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
            style={{ background: 'oklch(from var(--color-warning) l c h / 0.1)', color: 'var(--color-warning)' }}
          >
            Your budget is currently setting the group limit
          </motion.div>
        )}
      </div>
    )
  }

  // Editing / new budget state
  const showInput = isEditing || !hasExisting
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock size={16} className="text-teal" />
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            {hasExisting ? 'Edit Your Budget' : 'Set Your Private Budget'}
          </span>
        </div>
        <PrivacyIndicator />
      </div>

      {showInput && (
        <div className="flex gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold" style={{ color: 'var(--text-secondary)' }}>$</span>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="0"
              min={0}
              max={100000}
              step={100}
              className="w-full rounded-xl py-3 pl-8 pr-4 text-xl font-semibold outline-none transition-colors"
              style={{ background: 'var(--bg-surface)', border: '2px solid var(--accent-primary)', color: 'var(--text-primary)' }}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          </div>
          <button
            onClick={handleSave}
            disabled={isPending || !inputValue}
            className="flex items-center gap-2 rounded-xl px-5 py-3 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: 'var(--accent-primary)' }}
          >
            <Check size={16} />
            {isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      )}

      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
        Only you can see this amount. It will never be shared with other members.
      </p>
    </div>
  )
}
