import React from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card'
import { CITY_CONFIGS, type CitySlug } from '@/lib/city-colors'
import { cn } from '@/lib/utils'

interface CityCardProps {
  city: CitySlug
  title?: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
  showIcon?: boolean
}

/**
 * City-themed card component with automatic color styling
 * based on TripFlow's city color system.
 *
 * @example
 * <CityCard city="shanghai" title="Shanghai Budget">
 *   <BudgetContent />
 * </CityCard>
 */
export function CityCard({
  city,
  title,
  description,
  children,
  footer,
  className,
  showIcon = true,
}: CityCardProps) {
  const config = CITY_CONFIGS[city]
  const Icon = config.icon

  return (
    <Card
      className={cn(
        'border-l-4 transition-all duration-300',
        'hover:shadow-lg hover:-translate-y-0.5',
        className
      )}
      style={{
        borderLeftColor: `var(${config.cssVar})`,
        '--city-color': `var(${config.cssVar})`,
        '--city-glow': `var(${config.cssVar}-glow)`,
      } as React.CSSProperties}
    >
      {(title || description) && (
        <CardHeader>
          {title && (
            <CardTitle className="flex items-center gap-2">
              {showIcon && (
                <Icon
                  size={20}
                  style={{ color: `var(${config.cssVar})` }}
                  aria-hidden="true"
                />
              )}
              <span>{title}</span>
            </CardTitle>
          )}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}

      <CardContent className="pt-6">{children}</CardContent>

      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  )
}

// Export with displayName for better debugging
CityCard.displayName = 'CityCard'
