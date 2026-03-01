"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AIGeneratorWizard.css';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Users, DollarSign, Sparkles, X, ChevronRight, ChevronLeft, Check, Coffee, Mountain, Music, Tent } from 'lucide-react';

interface AIGeneratorWizardProps {
  onClose: () => void;
  onComplete: (tripData: { destination: string; dates: string; travelers: number; budget: string; vibes: string[] }) => void;
}

const WIZARD_STEPS = 4;

export const AIGeneratorWizard: React.FC<AIGeneratorWizardProps> = ({ onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initializing neural engine...");

  // Form State
  const [destination, setDestination] = useState('');
  const [dates, setDates] = useState('');
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState('Mid-range');
  const [vibes, setVibes] = useState<string[]>([]);

  const handleNext = () => {
    if (step < WIZARD_STEPS) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleVibe = (vibe: string) => {
    if (vibes.includes(vibe)) {
      setVibes(vibes.filter(v => v !== vibe));
    } else {
      if (vibes.length < 3) setVibes([...vibes, vibe]);
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setStep(WIZARD_STEPS + 1); // Move to generation screen

    const statuses = [
      "Analyzing 4,200 Tokyo dining options...",
      "Optimizing transit routes for efficiency...",
      "Balancing itinerary pacing...",
      "Finding hidden gems nearby...",
      "Finalizing your perfect trip..."
    ];

    let currentProgress = 0;
    let statusIndex = 0;

    const interval = setInterval(() => {
      currentProgress += 2;
      setGenerationProgress(currentProgress);

      if (currentProgress % 20 === 0 && statusIndex < statuses.length) {
        setStatusText(statuses[statusIndex]);
        statusIndex++;
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete({ destination, dates, travelers, budget, vibes });
        }, 1000);
      }
    }, 50);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="ai-wizard-overlay"
        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      >
        <motion.div
          className="ai-wizard-modal"
          initial={{ scale: 0.95, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 20, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          {!isGenerating && (
            <button className="wizard-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          )}

          {!isGenerating ? (
            <div className="wizard-content">
              <div className="wizard-header">
                <h2>
                  <Sparkles className="sparkle-icon" size={24} />
                  Design Your Dream Trip
                </h2>
                <div className="wizard-progress-bar">
                  <div className="progress-fill" style={{ width: `${(step / WIZARD_STEPS) * 100}%` }}></div>
                </div>
                <div className="wizard-step-label">Step {step} of {WIZARD_STEPS}</div>
              </div>

              <div className="wizard-body">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      className="wizard-step"
                      initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
                    >
                      <h3>Where and when?</h3>
                      <p className="text-secondary mb-4">Let&apos;s start with the basics. Where is the AI taking you?</p>

                      <div className="input-group">
                        <label>Destination</label>
                        <div className="input-with-icon">
                          <MapPin size={18} />
                          <input
                            type="text"
                            className="glass-input full-width-input"
                            placeholder="e.g., Tokyo, Japan"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            autoFocus
                          />
                        </div>
                      </div>

                      <div className="input-group mt-4">
                        <label>Dates</label>
                        <div className="input-with-icon">
                          <Calendar size={18} />
                          <input
                            type="text"
                            className="glass-input full-width-input"
                            placeholder="e.g., Oct 12 - Oct 20"
                            value={dates}
                            onChange={(e) => setDates(e.target.value)}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      className="wizard-step"
                      initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
                    >
                      <h3>Who is traveling?</h3>
                      <p className="text-secondary mb-4">We&apos;ll optimize the itinerary for your group size.</p>

                      <div className="counter-group">
                        <Users size={24} className="text-secondary" />
                        <div className="counter-controls">
                          <button className="counter-btn" onClick={() => setTravelers(Math.max(1, travelers - 1))}>-</button>
                          <span className="counter-value">{travelers}</span>
                          <button className="counter-btn" onClick={() => setTravelers(travelers + 1)}>+</button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      className="wizard-step"
                      initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
                    >
                      <h3>What&apos;s your budget style?</h3>
                      <p className="text-secondary mb-4">This helps us recommend the right hotels and dining.</p>

                      <div className="selection-grid">
                        {['Budget Explorer', 'Mid-range', 'Comfort Luxury', 'Ultra Premium'].map((b) => (
                          <div
                            key={b}
                            className={`selection-card ${budget === b ? 'selected' : ''}`}
                            onClick={() => setBudget(b)}
                          >
                            <DollarSign size={20} className={budget === b ? 'text-accent' : 'text-secondary'} />
                            <span>{b}</span>
                            {budget === b && <Check size={16} className="check-icon" />}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === 4 && (
                    <motion.div
                      key="step4"
                      className="wizard-step"
                      initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
                    >
                      <h3>Select your vibes</h3>
                      <p className="text-secondary mb-4">Pick up to 3 themes to heavily influence your itinerary.</p>

                      <div className="tags-grid">
                        {[
                          { id: 'foodie', label: 'Foodie', icon: <Coffee size={16}/> },
                          { id: 'adventure', label: 'Adventure', icon: <Mountain size={16}/> },
                          { id: 'culture', label: 'Culture', icon: <MapPin size={16}/> },
                          { id: 'nightlife', label: 'Nightlife', icon: <Music size={16}/> },
                          { id: 'nature', label: 'Nature', icon: <Tent size={16}/> },
                          { id: 'relaxation', label: 'Relaxation', icon: <Sparkles size={16}/> },
                        ].map((vibe) => (
                          <div
                            key={vibe.id}
                            className={`vibe-tag ${vibes.includes(vibe.id) ? 'selected' : ''}`}
                            onClick={() => toggleVibe(vibe.id)}
                          >
                            {vibe.icon}
                            <span>{vibe.label}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="wizard-footer">
                {step > 1 ? (
                  <Button variant="ghost" onClick={handleBack}>
                    <ChevronLeft size={16}/>
                    Back
                  </Button>
                ) : <div></div>}

                {step < WIZARD_STEPS ? (
                  <Button onClick={handleNext}>Next <ChevronRight size={16} style={{ marginLeft: 8 }}/></Button>
                ) : (
                  <Button variant="default" className="magic-generate-btn" onClick={handleGenerate}>
                    <Sparkles size={16}/>
                    Generate Trip
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="wizard-generating-state">
              <div className="ai-core-animation">
                <div className="orbit orbit-1"></div>
                <div className="orbit orbit-2"></div>
                <div className="orbit orbit-3"></div>
                <div className="core-sparkle">
                  <Sparkles size={48} className="text-accent" />
                </div>
              </div>
              <h2 className="generating-title">Curating Your Journey</h2>
              <p className="generating-status">{statusText}</p>

              <div className="big-progress-container">
                <div className="big-progress-bar">
                  <div className="big-progress-fill" style={{ width: `${generationProgress}%` }}></div>
                </div>
                <div className="progress-percentage">{generationProgress}%</div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
