"use client"

import React from 'react';
import { motion, type Variants } from 'framer-motion';
import './Dashboard.css';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Globe } from '../ui/Globe';
import { Map, Wallet, Sparkles, Train, MapPin, AlertCircle, Clock, ChevronRight, Plane, Cloud, ReceiptText, ArrowRight } from 'lucide-react';

// Use trips passed from App

const activityFeed = [
  { id: 1, text: 'Sarah booked the Shinkansen tickets', time: '2 hours ago', icon: <Train size={16} /> },
  { id: 2, text: 'AI suggested 3 new dining options in Kyoto', time: '5 hours ago', icon: <Sparkles size={16} /> },
  { id: 3, text: 'You added TeamLab Planets to itinerary', time: '1 day ago', icon: <MapPin size={16} /> }
];

const pendingActions = [
  { id: 1, text: 'Vote on Kyoto Housing (3 options)', trip: 'Japan Circuit', urgency: 'high', icon: <AlertCircle size={18} /> },
  { id: 2, text: 'Review Safari Budget', trip: 'Kenya Adventure', urgency: 'medium', icon: <Clock size={18} /> },
  { id: 3, text: 'Confirm flight times', trip: 'Japan Circuit', urgency: 'high', icon: <AlertCircle size={18} /> }
];

const magicDrafts = [
  { id: 1, title: 'Greek Islands Hopper', tags: ['7 Days', 'Coastal', 'Relaxation'], img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800&auto=format&fit=crop' },
  { id: 2, title: 'Andalusian Roadtrip', category: 'Culture', img: 'https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?q=80&w=600&auto=format&fit=crop', tags: ['10 Days', 'Culture', 'Food'] },
  { id: 3, title: 'Bali Zen Retreat', tags: ['5 Days', 'Wellness', 'Nature'], img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop' }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export interface TripData {
  id: number;
  destination: string;
  dates: string;
  status: string;
  progress: number;
  imageUrl: string;
  collaborators: number;
  accentColor: string;
}

interface DashboardProps {
  trips: TripData[];
  onTripClick?: (trip: TripData) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ trips, onTripClick }) => {
  // Mock logic: Assume the first trip is imminent if it's "Japan Circuit" in PLANNING for demo
  const imminentTrip = trips.length > 0 && trips[0].destination === 'Japan Circuit' ? trips[0] : null;

  return (
    <motion.div
      className="dashboard-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="dashboard-globe-bg">
        <Globe size={1000} />
      </div>

      {/* Focus Mode: Active Trip Hero */}
      {imminentTrip ? (
        <motion.div variants={itemVariants} className="active-trip-hero" style={{ backgroundImage: `url(${imminentTrip.imageUrl})` }}>
          <div className="active-trip-hero-overlay"></div>
          <div className="active-trip-hero-content">
            <div className="hero-status-badge">Upcoming in 14 Days</div>
            <h1 className="hero-destination">{imminentTrip.destination}</h1>
            <p className="hero-dates">{imminentTrip.dates}</p>

            <div className="hero-quick-actions">
              <Button variant="secondary" className="glass-btn"><Plane size={16} /> Boarding Passes</Button>
              <Button variant="secondary" className="glass-btn"><Cloud size={16} /> 22°C Tokyo</Button>
              <Button variant="secondary" className="glass-btn"><ReceiptText size={16} /> Quick Expense</Button>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="stats-grid">
          {/* Fallback Hero Stats Section if no imminent trip */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="stat-card-content">
                <div className="stat-icon-wrapper blue"><Map size={24} color="var(--color-blue)" /></div>
                <div>
                  <div className="stat-value">2</div>
                  <div className="stat-label">Active Trips</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="stat-card-content">
                <div className="stat-icon-wrapper green"><Wallet size={24} color="var(--color-green)" /></div>
                <div>
                  <div className="stat-value">$4,250</div>
                  <div className="stat-label">Budget Tracked</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="stat-card-content">
                <div className="stat-icon-wrapper purple"><Sparkles size={24} color="var(--color-amber)" /></div>
                <div>
                  <div className="stat-value">14</div>
                  <div className="stat-label">AI Suggestions</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      <div className="dashboard-main-columns">
        {/* Left Column: Trips */}
        <div className="trips-section">
          <div className="section-header">
            <h2>Your Journeys</h2>
            <Button variant="ghost" size="sm">View All</Button>
          </div>

          <div className="trip-cards-grid">
            {trips.map(trip => (
              <motion.div key={trip.id} variants={itemVariants}>
                <Card
                  className="interactive-trip-card"
                  onClick={() => onTripClick && onTripClick(trip)}
                >
                <div className="trip-card-image-wrapper">
                  <div
                    className="trip-card-image"
                    style={{ backgroundImage: `url(${trip.imageUrl})` }}
                  >
                    <div className="trip-card-image-overlay">
                      <span
                        className="status-badge"
                        style={{
                          backgroundColor: 'var(--bg-surface)',
                          color: trip.accentColor,
                          border: `1px solid ${trip.accentColor}`
                        }}
                      >
                        {trip.status}
                      </span>
                    </div>
                  </div>
                </div>

                <CardContent className="trip-card-details">
                  <div className="trip-card-top-info">
                    <h3 className="trip-destination-title">{trip.destination}</h3>
                    <div className="trip-dates-text">{trip.dates}</div>
                  </div>

                  <div className="trip-progress-section">
                    <div className="progress-header">
                      <span>Completion</span>
                      <span>{trip.progress}%</span>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{ width: `${trip.progress}%`, background: trip.accentColor }}
                      ></div>
                    </div>
                  </div>

                  <div className="trip-card-footer-actions">
                    <div className="collaborator-avatars">
                      {[...Array(trip.collaborators)].map((_, i) => (
                        <div key={i} className="avatar-circle" style={{ zIndex: 10 - i }}></div>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onTripClick) onTripClick(trip);
                      }}
                    >
                      Open
                    </Button>
                  </div>
                </CardContent>
              </Card>
              </motion.div>
            ))}

            {/* Create New Prompt Card */}
            <motion.div variants={itemVariants}>
            <Card className="create-new-card">
              <CardContent className="create-new-content">
                <div className="create-icon"><Sparkles size={32} /></div>
                <div className="create-new-text">
                  <h3 style={{ margin: '0 0 4px 0' }}>Where to next?</h3>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Let AI draft your perfect itinerary in seconds.</p>
                </div>
                <Button>Generate New Trip</Button>
              </CardContent>
            </Card>
            </motion.div>
          </div>

          {/* Magic Drafts Section */}
          <div className="magic-drafts-section mt-8">
            <div className="section-header">
              <h2>Magic Drafts</h2>
              <span className="text-secondary" style={{ fontSize: '0.9rem' }}>Curated for you by AI</span>
            </div>
            <div className="magic-drafts-grid">
              {magicDrafts.map(draft => (
                <motion.div key={draft.id} variants={itemVariants}>
                  <Card className="draft-card" style={{ backgroundImage: `url(${draft.img})` }}>
                    <div className="draft-overlay"></div>
                    <CardContent className="draft-content">
                      <div className="draft-tags">
                        {draft.tags.map((tag, i) => <span key={i} className="draft-tag">{tag}</span>)}
                      </div>
                      <h3 className="draft-title">{draft.title}</h3>
                      <button className="draft-adopt-btn">Adopt Trip <ArrowRight size={14} /></button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Activity & Alerts */}
        <div className="sidebar-section">
          {/* AI Daily Briefing */}
          <motion.div variants={itemVariants}>
            <Card className="ai-briefing-card glass-panel mb-6">
              <CardContent className="ai-briefing-content">
                <div className="briefing-header">
                  <Sparkles size={18} className="text-accent" />
                  <h4>Daily Travel Intel</h4>
                </div>
                <p className="briefing-text">
                  Your Japan trip is exactly 14 days away! The weather in Tokyo is currently a pleasant 22°C. I noticed you haven't booked your JR Pass yet—should I build a transit route for you?
                </p>
                <Button size="sm" variant="secondary" className="mt-4" fullWidth>Review Transit Options</Button>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
          <Card className="activity-feed-card">
            <CardHeader className="feed-header-flex">
              <CardTitle style={{ fontSize: '1.1rem' }}>Team Activity</CardTitle>
              <div className="live-presence-indicator">
                <div className="presence-avatar">
                  <img src="https://i.pravatar.cc/150?u=2" alt="Sarah" />
                  <div className="online-dot"></div>
                </div>
                <span className="presence-text">Sarah is viewing Kyoto Hotels</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="feed-list">
                {activityFeed.map(item => (
                  <div key={item.id} className="feed-item">
                    <div className="feed-icon">{item.icon}</div>
                    <div className="feed-details">
                      <p>{item.text}</p>
                      <span className="feed-time">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
          <Card className="action-required-card mt-6">
            <CardHeader className="action-header">
              <CardTitle style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="pulse-dot"></div>
                Waiting for You
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="action-list">
                {pendingActions.map(action => (
                  <div key={action.id} className={`action-list-item urgency-${action.urgency}`}>
                    <div className="action-icon-container">
                      {action.icon}
                    </div>
                    <div className="action-details">
                      <p className="action-text">{action.text}</p>
                      <p className="action-trip">{action.trip}</p>
                    </div>
                    <button className="action-resolve-btn">
                      Resolve <ChevronRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
