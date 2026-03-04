import { LoginForm } from '@/components/auth/LoginForm'
import Image from 'next/image'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen relative items-center justify-center p-4 overflow-y-auto">
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2940&auto=format&fit=crop"
          alt="Beautiful mountain landscape"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Lightened gradient overlay for better legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        {/* Logo/Brand Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2 font-display drop-shadow-lg">TripFlow</h1>
          <p className="text-white/80 text-lg font-medium drop-shadow-md">Your ultimate journey begins here.</p>
        </div>

        {/* Glassmorphism Card - Using .glass-panel utility without conflicts */}
        <div className="w-full glass-panel p-8 sm:p-10">
          <div className="flex flex-col space-y-2 text-center mb-8">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground font-display">Welcome back</h2>
            <p className="text-muted-foreground text-sm">
              Enter your credentials to access your trips
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  )
}
