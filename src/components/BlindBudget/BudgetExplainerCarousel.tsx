"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Users, TrendingUp, ArrowRight, ArrowLeft } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

const STEPS = [
  {
    icon: Lock,
    title: 'Your budget stays private',
    description: 'Set a personal budget cap that only you can see. Not even the trip organizer knows your number.',
    color: 'text-teal',
    bg: 'bg-privacy-light',
  },
  {
    icon: Users,
    title: 'We calculate a group limit',
    description: "The system takes the minimum of everyone's private caps to find what the whole group can afford. No individual amounts are ever revealed.",
    color: 'text-teal',
    bg: 'bg-privacy-light',
  },
  {
    icon: TrendingUp,
    title: 'Plan together, spend smart',
    description: "Activities and suggestions are filtered by the group's affordable limit. Everyone plans within a comfortable range without awkward money conversations.",
    color: 'text-teal',
    bg: 'bg-privacy-light',
  },
]

interface BudgetExplainerCarouselProps {
  open: boolean
  onClose: () => void
  onComplete: () => void
}

export function BudgetExplainerCarousel({ open, onClose, onComplete }: BudgetExplainerCarouselProps) {
  const [step, setStep] = useState(0)
  const current = STEPS[step]
  const isLast = step === STEPS.length - 1
  const Icon = current.icon

  const handleNext = () => {
    if (isLast) {
      onComplete()
      setStep(0)
    } else {
      setStep(s => s + 1)
    }
  }

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1)
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">How Blind Budgeting Works</DialogTitle>
          <DialogDescription className="sr-only">Learn how private budget caps work</DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center gap-4 py-6 text-center"
          >
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${current.bg}`}>
              <Icon size={28} className={current.color} />
            </div>
            <h3 className="text-base font-semibold">{current.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed px-4">{current.description}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center gap-2 pb-2">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-6 bg-teal' : 'w-1.5 bg-muted'}`}
            />
          ))}
        </div>

        <div className="flex justify-between pt-2">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-0 transition-all"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-1 rounded-lg bg-teal px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            {isLast ? 'Set My Budget' : 'Next'} <ArrowRight size={14} />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
