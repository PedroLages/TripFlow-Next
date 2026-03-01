import React from 'react'
import { CityCard } from './CityCard'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'
import { type CitySlug } from '@/lib/city-colors'
import { cn } from '@/lib/utils'

interface BudgetProgressCardProps {
  city: CitySlug
  totalBudget: number
  spent: number
  currencyCode?: string
  className?: string
}

/**
 * Displays budget progress for a specific city with visual indicators
 * for budget health (under/over budget).
 */
export function BudgetProgressCard({
  city,
  totalBudget,
  spent,
  currencyCode = 'USD',
  className,
}: BudgetProgressCardProps) {
  const percentage = (spent / totalBudget) * 100
  const remaining = totalBudget - spent
  const isOverBudget = percentage > 100
  const isNearLimit = percentage > 80 && !isOverBudget

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <CityCard
      city={city}
      className={className}
      footer={
        <div className="flex items-center justify-between w-full text-sm">
          <span className="text-muted-foreground">
            {formatCurrency(spent)} / {formatCurrency(totalBudget)}
          </span>
          <span
            className={cn(
              'font-medium flex items-center gap-1',
              isOverBudget && 'text-destructive',
              !isOverBudget && remaining < totalBudget * 0.2 && 'text-warning',
              !isOverBudget && remaining >= totalBudget * 0.2 && 'text-success'
            )}
          >
            {isOverBudget ? (
              <>
                <TrendingUp size={14} />
                {formatCurrency(Math.abs(remaining))} over
              </>
            ) : (
              <>
                <TrendingDown size={14} />
                {formatCurrency(remaining)} remaining
              </>
            )}
          </span>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Budget Progress</span>
            <Badge
              variant={
                isOverBudget
                  ? 'destructive'
                  : isNearLimit
                  ? 'outline'
                  : 'secondary'
              }
            >
              {percentage.toFixed(0)}%
            </Badge>
          </div>
          <Progress
            value={Math.min(percentage, 100)}
            className={cn(
              'h-2',
              isOverBudget && '[&>div]:bg-destructive',
              isNearLimit && '[&>div]:bg-warning'
            )}
          />
        </div>

        {/* Warnings */}
        {isOverBudget && (
          <Alert variant="destructive">
            <AlertTriangle size={16} />
            <AlertDescription>
              You&apos;ve exceeded your budget by {formatCurrency(Math.abs(remaining))}.
              Consider adjusting activities or increasing your budget.
            </AlertDescription>
          </Alert>
        )}

        {isNearLimit && (
          <Alert>
            <AlertTriangle size={16} />
            <AlertDescription>
              You&apos;ve used {percentage.toFixed(0)}% of your budget. Plan
              remaining expenses carefully.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </CityCard>
  )
}

BudgetProgressCard.displayName = 'BudgetProgressCard'
