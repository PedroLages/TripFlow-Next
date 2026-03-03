"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import './Dashboard.css';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/ButtonLegacy';
import { Globe } from '../ui/Globe';
import { CountdownWidget } from './CountdownWidget';
import { Map, Wallet, Sparkles, Train, MapPin, AlertCircle, Clock, ChevronRight, Plane, Cloud, ReceiptText, ArrowRight } from 'lucide-react';

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
    transition: { staggerChildren: 0.08 }
  },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

const reducedMotionVariants: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 }
};

export interface TripData {
  id: number;
  destination: string;
  dates: string;
  status: string;
  progress: number;
  imageUrl: string;
  collaborators: number;
  collaboratorAvatars?: string[]; // Avatar URLs for collaborators
  accentColor: string;
  departureDate?: string; // ISO date string for countdown
}

interface DashboardProps {
  trips: TripData[];
  onGenerateTrip?: () => void;
  onQuickExpense?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ trips, onGenerateTrip, onQuickExpense }) => {
  const imminentTrip = trips.length > 0 && trips[0].destination === 'Japan Circuit' ? trips[0] : null;

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const resolvedItemVariants = prefersReducedMotion ? reducedMotionVariants : itemVariants;

  const [activeTab, setActiveTab] = useState<'activity' | 'actions'>('activity');

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

      {/* Hero Banner */}
      {imminentTrip && (
        <Link href={`/trips/${imminentTrip.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <motion.div variants={resolvedItemVariants} className="active-trip-hero" style={{ backgroundImage: `url(${imminentTrip.imageUrl})`, cursor: 'pointer' }}>
            <div className="active-trip-hero-overlay"></div>
            <div className="active-trip-hero-content">
              {imminentTrip.departureDate && (
                <CountdownWidget departureDate={imminentTrip.departureDate} />
              )}
              <h2 className="hero-destination">{imminentTrip.destination}</h2>
              <p className="hero-dates">{imminentTrip.dates}</p>
              <div className="hero-quick-actions" onClick={(e) => e.preventDefault()}>
                <Button variant="secondary" className="glass-btn"><Plane size={16} /> Boarding Passes</Button>
                <Button variant="secondary" className="glass-btn"><Cloud size={16} /> 22°C Tokyo</Button>
                <Button
                  variant="secondary"
                  className="glass-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickExpense?.();
                  }}
                >
                  <ReceiptText size={16} /> Quick Expense
                </Button>
              </div>
            </div>
          </motion.div>
        </Link>
      )}

      {/* Persistent Stats (Never Hidden) */}
      <div className="stats-grid">
        <motion.div variants={resolvedItemVariants}>
          <Card>
            <CardContent className="stat-card-content">
              <div className="stat-icon-wrapper blue"><Map size={24} color="var(--color-blue)" /></div>
              <div>
                <div className="stat-value">{trips.length}</div>
                <div className="stat-label">Active Trips</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={resolvedItemVariants}>
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
        <motion.div variants={resolvedItemVariants}>
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

      {/* Urgent Action Banner */}
      {pendingActions.filter(a => a.urgency === 'high').length > 0 && (
        <motion.div variants={resolvedItemVariants} className="urgent-banner">
          <div className="urgent-banner-icon"><AlertCircle size={20} /></div>
          <div className="urgent-banner-content">
            <h4 className="urgent-banner-title">Action Required</h4>
            <p className="urgent-banner-text">{pendingActions.filter(a => a.urgency === 'high')[0].text} for {pendingActions.filter(a => a.urgency === 'high')[0].trip}</p>
          </div>
          <Button variant="secondary" size="sm" className="urgent-banner-btn">Resolve Now</Button>
        </motion.div>
      )}

      {/* Section Header */}
      <div className="section-header">
        <h2>Your Journeys</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            // Scroll to trips section or expand all
            const tripsSection = document.querySelector('.dashboard-bento-grid');
            tripsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        >
          View All
        </Button>
      </div>

      {/* Bento Grid */}
      <div className="dashboard-bento-grid">
        {/* Extracted Create New into a fixed visual block at the start of the grid */}
        <motion.div variants={resolvedItemVariants} className="bento-create-card">
          <Card className="create-new-card">
            <CardContent className="create-new-content">
              <div className="create-icon"><Sparkles size={32} /></div>
              <div className="create-new-text">
                <h3 style={{ margin: '0 0 4px 0' }}>Where to next?</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Let AI draft your perfect itinerary.</p>
              </div>
              <Button onClick={() => onGenerateTrip?.()} className="w-full">Generate Trip</Button>
            </CardContent>
          </Card>
        </motion.div>

        {trips.slice(0, 2).map(trip => (
          <motion.div key={trip.id} variants={resolvedItemVariants} className="bento-trip-card">
            <Link href={`/trips/${trip.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Card className="interactive-trip-card">
                <div className="trip-card-image-wrapper">
                  <div className="trip-card-image" style={{ backgroundImage: `url(${trip.imageUrl})` }}>
                    <div className="trip-card-image-overlay">
                      <span className="status-badge" style={{ backgroundColor: 'var(--bg-surface)', color: trip.accentColor, border: `1px solid ${trip.accentColor}` }}>
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
                      <span style={{ fontVariantNumeric: 'tabular-nums' }}>{trip.progress}%</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${trip.progress}%`, background: trip.accentColor }}></div>
                    </div>
                  </div>
                  <div className="trip-card-footer-actions">
                    <div className="collaborator-avatars">
                      {trip.collaboratorAvatars?.slice(0, 3).map((avatar, i) => (
                        <div key={i} className="avatar-circle" style={{ zIndex: 10 - i }}>
                          <img src={avatar} alt={`Collaborator ${i + 1}`} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        </div>
                      )) || [...Array(trip.collaborators)].map((_, i) => (
                        <div key={i} className="avatar-circle" style={{ zIndex: 10 - i }}></div>
                      ))}
                      {trip.collaborators > 3 && (
                        <div className="avatar-circle avatar-overflow" style={{ zIndex: 7 }}>
                          <span>+{trip.collaborators - 3}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}

        {/* AI Briefing — 4 cols */}
        <motion.div variants={resolvedItemVariants} className="bento-ai-briefing">
          <Card className="ai-briefing-card glass-panel">
            <CardContent className="ai-briefing-content">
              <div className="briefing-header">
                <Sparkles size={18} className="text-accent" />
                <h4>Daily Travel Intel</h4>
              </div>
              <p className="briefing-text">
                Your Japan trip is exactly 14 days away! The weather in Tokyo is currently a pleasant 22°C. I noticed you haven't booked your JR Pass yet — should I build a transit route for you?
              </p>
              <Button size="sm" variant="secondary" className="mt-4" fullWidth>Review Transit Options</Button>
            </CardContent>
          </Card>
        </motion.div>



        {/* Merged Activity + Actions — 8 cols */}
        <motion.div variants={resolvedItemVariants} className="bento-activity-actions">
          <Card className="activity-actions-card">
            <div className="activity-actions-tabs" role="tablist">
              <button className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`} onClick={() => setActiveTab('activity')} role="tab" aria-selected={activeTab === 'activity'}>Activity</button>
              <button className={`tab-btn ${activeTab === 'actions' ? 'active' : ''}`} onClick={() => setActiveTab('actions')} role="tab" aria-selected={activeTab === 'actions'}>
                Actions <span className="tab-badge">{pendingActions.length}</span>
              </button>
            </div>
            <CardContent>
              {activeTab === 'activity' ? (
                <>
                  <div className="live-presence-indicator" style={{ marginBottom: '16px' }}>
                    <div className="presence-avatar">
                      <img src="https://i.pravatar.cc/150?u=2" alt="Sarah" width={32} height={32} />
                      <div className="online-dot"></div>
                    </div>
                    <span className="presence-text">Sarah is viewing Kyoto Hotels</span>
                  </div>
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
                </>
              ) : (
                <div className="action-list">
                  {pendingActions.map(action => (
                    <div key={action.id} className={`action-list-item urgency-${action.urgency}`}>
                      <div className="action-icon-container">{action.icon}</div>
                      <div className="action-details">
                        <p className="action-text">{action.text}</p>
                        <p className="action-trip">{action.trip}</p>
                      </div>
                      <button className="action-resolve-btn">Resolve <ChevronRight size={14} /></button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Magic Drafts */}
      <div className="magic-drafts-section">
        <div className="section-header">
          <h2>Magic Drafts</h2>
          <span className="text-secondary magic-drafts-subtitle">Curated for you by AI</span>
        </div>
        <div className="magic-drafts-grid">
          {magicDrafts.map(draft => (
            <motion.div key={draft.id} variants={resolvedItemVariants}>
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
    </motion.div>
  );
};
