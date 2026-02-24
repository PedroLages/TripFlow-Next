"use client"

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, MapPin, Navigation, Clock, ThumbsUp, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import './AISuggestionsPanel.css';

interface AISuggestionsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  day: string;
}

const mockSuggestions = [
  {
    id: 1,
    title: 'Omoide Yokocho (Memory Lane)',
    category: 'Food & Culture',
    duration: '1-2 hrs',
    match: 98,
    reason: 'Perfect dinner spot near Shinjuku Station after your afternoon exploration. Famous for yakitori.',
    imageUrl: 'https://images.unsplash.com/photo-1542051812871-75f412670f43?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'Tokyo Metropolitan Government Building',
    category: 'Sightseeing',
    duration: '1 hr',
    match: 92,
    reason: 'Free panoramic views of Tokyo. Best visited right before sunset.',
    imageUrl: 'https://images.unsplash.com/photo-1538644026725-b4618debb7e6?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'Golden Gai',
    category: 'Nightlife',
    duration: '2-3 hrs',
    match: 85,
    reason: 'Historic alleyways with hundreds of tiny bars. Great for evening drinks.',
    imageUrl: 'https://images.unsplash.com/photo-1551061917-7a2e2d93eacc?q=80&w=600&auto=format&fit=crop'
  }
];

export const AISuggestionsPanel: React.FC<AISuggestionsPanelProps> = ({ isOpen, onClose, day }) => {
  const containerVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring' as const, damping: 25, stiffness: 200 }
    },
    exit: { x: '100%', opacity: 0, transition: { duration: 0.3 } }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="panel-backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />
          <motion.div
            className="ai-suggestions-panel glass-panel"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="panel-header ai-themed">
              <div className="title-row">
                <h3 className="gradient-text"><Sparkles size={20} /> Smart Suggestions</h3>
                <button className="close-btn" onClick={onClose}><X size={20}/></button>
              </div>
              <p>Tailored recommendations for {day} based on your travel style and logistics.</p>
            </div>

            <div className="panel-content">
              <div className="suggestions-list">
                {mockSuggestions.map(suggestion => (
                  <div key={suggestion.id} className="suggestion-card">
                    <div
                      className="suggestion-image"
                      style={{ backgroundImage: `url(${suggestion.imageUrl})` }}
                    >
                      <div className="match-badge">
                        <ThumbsUp size={12} /> {suggestion.match}% Match
                      </div>
                    </div>

                    <div className="suggestion-details">
                      <div className="suggestion-header">
                        <h4>{suggestion.title}</h4>
                        <span className="suggestion-category">{suggestion.category}</span>
                      </div>

                      <p className="suggestion-reason">{suggestion.reason}</p>

                      <div className="suggestion-meta">
                        <span><Clock size={14} /> {suggestion.duration}</span>
                        <span><MapPin size={14} /> 15m from current</span>
                      </div>

                      <Button fullWidth size="sm" icon={<Plus size={16} />} className="mt-3">
                        Add to Itinerary
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="ai-context-box mt-6">
                <Navigation size={18} className="ai-icon" />
                <div>
                  <h4>Context Aware</h4>
                  <p>These suggestions are optimized for walking distance from your Shinjuku hotel.</p>
                </div>
              </div>
            </div>

            <div className="panel-footer">
              <Button variant="ghost" fullWidth>Gimme More Options</Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
