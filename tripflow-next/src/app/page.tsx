import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Users, TrendingUp, CheckCircle, Sparkles, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 w-full border-b backdrop-blur" style={{
        borderColor: 'var(--border-subtle)',
        backgroundColor: 'var(--bg-glass)'
      }}>
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center space-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-lg" style={{
            outlineColor: 'var(--accent-primary)'
          }}>
            <Calendar className="h-8 w-8" style={{ color: 'var(--accent-primary)' }} />
            <span className="text-2xl font-bold tracking-tight font-display" style={{ color: 'var(--text-primary)' }}>TripFlow</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-sm font-medium transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-lg" style={{
              color: 'var(--text-secondary)',
              outlineColor: 'var(--accent-primary)'
            }}>
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-lg" style={{
              color: 'var(--text-secondary)',
              outlineColor: 'var(--accent-primary)'
            }}>
              How It Works
            </Link>
            <Link href="/login" className="text-sm font-medium transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-lg" style={{
              color: 'var(--text-secondary)',
              outlineColor: 'var(--accent-primary)'
            }}>
              Login
            </Link>
            <Button asChild size="sm" className="text-sm font-semibold">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </nav>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
          {/* Cinematic Background */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2940&auto=format&fit=crop"
              alt="Travelers exploring a beautiful destination"
              fill
              priority
              className="object-cover object-center"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm" style={{
                backgroundColor: 'var(--accent-glow)',
                border: '1px solid var(--accent-primary)'
              }}>
                <Sparkles className="h-4 w-4" style={{ color: 'var(--accent-primary)' }} />
                <span className="text-sm font-medium text-white">Plan smarter, travel better</span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl mb-6 text-white font-display drop-shadow-lg">
                Group Travel Planning
                <br />
                <span style={{ color: 'var(--accent-primary)' }}>Without the Chaos</span>
              </h1>

              <p className="mx-auto max-w-2xl text-lg sm:text-xl mb-10 text-white/90 drop-shadow-md">
                The all-in-one platform for collaborative travel planning. Build itineraries,
                vote democratically, manage budgets anonymously, and split expenses—all in real-time.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button asChild size="lg" className="text-base px-8 h-12 w-full sm:w-auto font-semibold">
                  <Link href="/signup">Start Planning Free</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-base px-8 h-12 w-full sm:w-auto font-semibold backdrop-blur-sm border-white/30 text-white hover:bg-white/10">
                  <Link href="#how-it-works">See How It Works</Link>
                </Button>
              </div>

              <p className="mt-6 text-sm text-white/70">
                No credit card required • Free for up to 3 trips
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-24" style={{ backgroundColor: 'var(--bg-base)' }}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 font-display" style={{ color: 'var(--text-primary)' }}>
                Everything you need to plan together
              </h2>
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                Built for teams who want to travel smarter, not harder.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              <FeatureCard
                icon={<Users className="h-10 w-10" style={{ color: 'var(--accent-primary)' }} />}
                title="Collaborative Itinerary"
                description="Build your trip together in real-time. Everyone contributes, no one gets left out."
              />
              <FeatureCard
                icon={<CheckCircle className="h-10 w-10" style={{ color: 'var(--accent-primary)' }} />}
                title="Democratic Voting"
                description="Let the group decide on activities, restaurants, and destinations through fair voting."
              />
              <FeatureCard
                icon={<TrendingUp className="h-10 w-10" style={{ color: 'var(--accent-primary)' }} />}
                title="Blind Budgeting"
                description="Set budgets anonymously to find what works for everyone without awkward conversations."
              />
              <FeatureCard
                icon={<Sparkles className="h-10 w-10" style={{ color: 'var(--accent-primary)' }} />}
                title="Smart Scheduling"
                description="AI-powered suggestions help you optimize your itinerary for maximum enjoyment."
              />
              <FeatureCard
                icon={<TrendingUp className="h-10 w-10" style={{ color: 'var(--accent-primary)' }} />}
                title="Expense Splitting"
                description="Track and split expenses fairly. See who owes what at a glance."
              />
              <FeatureCard
                icon={<CheckCircle className="h-10 w-10" style={{ color: 'var(--accent-primary)' }} />}
                title="Task Assignment"
                description="Delegate booking and planning tasks. Track progress and never miss a deadline."
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 md:py-24" style={{ backgroundColor: 'var(--bg-surface)' }}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 font-display" style={{ color: 'var(--text-primary)' }}>
                How It Works
              </h2>
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                Get started in minutes and start planning your dream trip
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              <StepCard
                number="1"
                title="Create Your Trip"
                description="Set up your trip in seconds. Add destinations, dates, and invite your travel companions."
              />
              <StepCard
                number="2"
                title="Plan Together"
                description="Collaborate on activities, vote on options, and set budgets. Everyone's voice is heard."
              />
              <StepCard
                number="3"
                title="Travel With Ease"
                description="Access your itinerary anywhere. Track expenses, complete tasks, and enjoy your adventure."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-24 relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2940&auto=format&fit=crop"
              alt="Mountain landscape"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
          </div>

          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <Globe className="h-16 w-16 mx-auto mb-6" style={{ color: 'var(--accent-primary)' }} />
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-white font-display drop-shadow-lg">
                Ready to start planning?
              </h2>
              <p className="text-lg mb-8 text-white/90 drop-shadow-md">
                Join thousands of travelers who plan better together.
              </p>
              <Button asChild size="lg" className="text-base px-8 h-12 font-semibold">
                <Link href="/signup">Get Started Free</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8" style={{
        borderColor: 'var(--border-subtle)',
        backgroundColor: 'var(--bg-surface)'
      }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-6 w-6" style={{ color: 'var(--accent-primary)' }} />
              <span className="text-lg font-bold font-display" style={{ color: 'var(--text-primary)' }}>TripFlow</span>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              © {new Date().getFullYear()} TripFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="glass-panel p-6">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 font-display" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{description}</p>
    </div>
  )
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="glass-panel p-8 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4" style={{
        backgroundColor: 'var(--accent-primary)',
        color: 'white'
      }}>
        <span className="text-xl font-bold">{number}</span>
      </div>
      <h3 className="text-xl font-semibold mb-3 font-display" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{description}</p>
    </div>
  )
}
