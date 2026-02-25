import { Lock, Shield } from 'lucide-react'

interface PrivacyIndicatorProps {
  variant?: 'badge' | 'inline'
  label?: string
}

export function PrivacyIndicator({ variant = 'badge', label = 'Private' }: PrivacyIndicatorProps) {
  if (variant === 'inline') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-teal">
        <Lock size={12} />
        {label}
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-privacy-light px-3 py-1 text-xs font-semibold text-teal">
      <Shield size={12} />
      {label}
    </span>
  )
}
