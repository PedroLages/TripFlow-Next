import type { Metadata, Viewport } from 'next'
import { Providers } from '@/components/layout/Providers'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { AppShell } from '@/components/layout/AppShell'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'
import './app.css'

export const metadata: Metadata = {
  title: 'TripFlow AI',
  description: 'AI-powered collaborative trip planning',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#121212' },
    { media: '(prefers-color-scheme: light)', color: '#fcfcfc' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" style={{ colorScheme: 'dark light' }}>
      <body>
        <ThemeProvider>
          <Providers>
            <AppShell>{children}</AppShell>
          </Providers>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
