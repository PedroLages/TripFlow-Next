import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Dashboard } from '@/components/Dashboard/Dashboard'

export default async function DashboardPage() {
  // Check authentication
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Mock trips data for now (will be replaced with real data from Supabase)
  const trips = []

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-base)' }}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
          Welcome back!
        </h1>
        <Dashboard trips={trips} />
      </div>
    </div>
  )
}
