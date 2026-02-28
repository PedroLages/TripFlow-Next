"use client"

import React from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { CITY_CONFIGS, type CitySlug } from '@/lib/city-colors'
import { cn } from '@/lib/utils'

interface CityTabsProps {
  cities: CitySlug[]
  defaultCity?: CitySlug
  onCityChange?: (city: CitySlug) => void
  children: (city: CitySlug) => React.ReactNode
  className?: string
}

/**
 * City navigation tabs with color-coded indicators.
 * Renders tab content for each city dynamically.
 */
export function CityTabs({
  cities,
  defaultCity,
  onCityChange,
  children,
  className,
}: CityTabsProps) {
  return (
    <Tabs
      defaultValue={defaultCity || cities[0]}
      onValueChange={(value) => onCityChange?.(value as CitySlug)}
      className={cn('w-full', className)}
    >
      <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${cities.length}, 1fr)` }}>
        {cities.map((city) => {
          const config = CITY_CONFIGS[city]
          const Icon = config.icon

          return (
            <TabsTrigger
              key={city}
              value={city}
              className="gap-2 data-[state=active]:shadow-sm"
            >
              <span
                className="size-2 rounded-full transition-transform data-[state=active]:scale-125"
                style={{ backgroundColor: `var(${config.cssVar})` }}
                aria-hidden="true"
              />
              <Icon size={14} aria-hidden="true" />
              <span className="hidden sm:inline">{config.name}</span>
              <span className="sm:hidden">{config.name.slice(0, 3)}</span>
            </TabsTrigger>
          )
        })}
      </TabsList>

      {cities.map((city) => (
        <TabsContent key={city} value={city} className="mt-6">
          {children(city)}
        </TabsContent>
      ))}
    </Tabs>
  )
}

CityTabs.displayName = 'CityTabs'
