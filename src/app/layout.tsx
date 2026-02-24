import type { Metadata } from 'next'
import { Providers } from '@/components/layout/Providers'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { Sidebar } from '@/components/layout/Sidebar'
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
            <div className="app-container">
              <Sidebar />
              <main className="main-content">
                {children}
              </main>
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
