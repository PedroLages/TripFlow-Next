"use client"

import { SignupForm } from '@/components/auth/SignupForm'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function SignupPage() {
  return (
    <div className="flex min-h-screen bg-bg-surface">
      {/* Left Panel - Hero Image */}
      <div className="relative hidden w-[45%] lg:block xl:w-1/2 overflow-hidden">
        <motion.div
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2940&auto=format&fit=crop"
            alt="Beautiful travel destination"
            fill
            priority
            sizes="(max-width: 1024px) 0vw, 45vw"
            className="object-cover object-center"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col justify-between p-12 text-white z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <Link href="/" className="text-2xl font-bold tracking-tight text-white drop-shadow-md hover:text-white/90 transition-colors">
              Tripify
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="max-w-xl"
          >
            <h2 className="text-3xl font-bold leading-[1.2] mb-6 text-white drop-shadow-lg">
              Start planning your next adventure.
            </h2>
            <p className="text-lg text-white/80 font-medium drop-shadow-md leading-[1.5]">
              Join thousands of travelers who plan better together. Discover new destinations, organize your itinerary, and track your budget in one seamless platform.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-[20px] lg:w-[55%] xl:w-1/2 lg:px-24 xl:px-32 bg-bg-surface relative z-10">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="mx-auto w-full max-w-[440px]"
        >
          {/* Mobile Logo */}
          <div className="mb-10 lg:hidden text-center">
            <Link href="/" className="text-2xl font-bold tracking-tight text-accent-primary drop-shadow-sm">
              Tripify
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary leading-[1.2] mb-2">Create your account</h1>
            <p className="text-base text-text-secondary leading-[1.5]">
              Enter your details to get started with Tripify and join the community.
            </p>
          </div>

          <div className="bg-bg-surface sm:p-0 rounded-lg border-none shadow-none">
            <SignupForm />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
