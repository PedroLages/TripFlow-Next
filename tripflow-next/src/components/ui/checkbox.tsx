"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, checked, ...props }, ref) => {
    const generatedId = React.useId()
    const checkboxId = id || generatedId

    return (
      <div className="flex items-center gap-2">
        {/* Touch target wrapper for WCAG 2.1 AA compliance (44×44px minimum) */}
        <div className="inline-flex items-center justify-center min-h-[var(--size-touch)] min-w-[var(--size-touch)]">
          <input
            type="checkbox"
            id={checkboxId}
            ref={ref}
            checked={checked}
            className={cn(
              "h-5 w-5 rounded border-input bg-transparent cursor-pointer",
              "text-accent-primary focus-visible:ring-ring/50 focus-visible:ring-2 focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            {...props}
          />
        </div>
        {label && (
          <label
            htmlFor={checkboxId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
          >
            {label}
          </label>
        )}
      </div>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
