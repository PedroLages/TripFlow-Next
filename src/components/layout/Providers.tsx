"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MockAuthProvider } from '@/lib/mock-auth'
import { useState, type ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
          },
        },
      })
  )

  return (
    <MockAuthProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </MockAuthProvider>
  )
}
