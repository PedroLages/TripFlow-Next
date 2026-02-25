import type { Metadata } from 'next'
import { Providers } from '@/components/layout/Providers'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { AppShell } from '@/components/layout/AppShell'
import './globals.css'
import './app.css'

export const metadata: Metadata = {
  title: 'TripFlow AI',
  description: 'AI-powered collaborative trip planning',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Providers>
            <AppShell>{children}</AppShell>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
