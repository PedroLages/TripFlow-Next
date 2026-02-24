"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import './Itinerary.css';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { AISuggestionsPanel } from '../AIGenerator/AISuggestionsPanel';
import { Plane, Hotel, Utensils, Camera, MapPin, Sparkles, Plus, Compass, ThumbsUp, ThumbsDown, MessageSquare, Send, ShoppingBag, Map, Train, Footprints, CheckCircle2, AlertCircle } from 'lucide-react';

// Mock data for the itinerary timeline
const days = ['Day 1 - Oct 12', 'Day 2 - Oct 13', 'Day 3 - Oct 14'];

const GmpMap = 'gmp-map' as any;
const GmpAdvancedMarker = 'gmp-advanced-marker' as any;

interface ActivityComment {
  id: number;
  user: string;
  avatar: string;
  text: string;
  time: string;
}

interface Activity {
  id: number;
  time: string;
  title: string;
  type: string;
  duration: number;
  day: number;
  votes: { up: number; down: number };
  comments: ActivityComment[];
  imageUrl?: string;
  status?: 'Booked' | 'Must Do' | 'Optional';
  transitToNext?: { method: 'walk' | 'train' | 'car'; duration: number };
}

const initialActivities: Activity[] = [
  { id: 1, time: '09:00 AM', title: 'Arrive at Narita Airport', type: 'flight', duration: 120, day: 0, votes: { up: 3, down: 0 }, comments: [], imageUrl: 'https://images.unsplash.com/photo-1542051812871-75f2c24f2b18?q=80&w=800&auto=format&fit=crop', status: 'Booked', transitToNext: { method: 'train', duration: 75 } },
  { id: 2, time: '12:30 PM', title: 'Check in at Shinjuku Hotel', type: 'hotel', duration: 60, day: 0, votes: { up: 4, down: 0 }, comments: [], status: 'Booked', transitToNext: { method: 'walk', duration: 15 } },
  { id: 3, time: '02:00 PM', title: 'Lunch at Ichiran Ramen', type: 'food', duration: 90, day: 0, votes: { up: 4, down: 0 }, comments: [{ id: 101, user: 'Sarah J.', avatar: 'https://i.pravatar.cc/150?u=2', text: 'Cant wait for this! 🍜', time: '1d ago' }], imageUrl: 'https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=800&auto=format&fit=crop', status: 'Must Do', transitToNext: { method: 'walk', duration: 10 } },
  { id: 4, time: '04:00 PM', title: 'Explore Shinjuku Gyoen', type: 'activity', duration: 120, day: 0, votes: { up: 2, down: 1 }, comments: [], imageUrl: 'https://images.unsplash.com/photo-1606214228965-c323fc19fbfa?q=80&w=800&auto=format&fit=crop', status: 'Optional' },

  { id: 5, time: '08:30 AM', title: 'Breakfast at Tsukiji Outer Market', type: 'food', duration: 120, day: 1, votes: { up: 4, down: 0 }, comments: [], status: 'Must Do', transitToNext: { method: 'train', duration: 25 } },
  { id: 6, time: '11:00 AM', title: 'TeamLab Planets Tokyo', type: 'activity', duration: 180, day: 1, votes: { up: 3, down: 0 }, comments: [{ id: 102, user: 'Alex M.', avatar: 'https://i.pravatar.cc/150?u=3', text: 'I booked the tickets for 11:30 AM.', time: '2h ago' }], imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800&auto=format&fit=crop', status: 'Booked' },
];

export const Itinerary: React.FC = () => {
  const [activeDay, setActiveDay] = useState(1);
  const [expandedActivity, setExpandedActivity] = useState<number | null>(6);

  useEffect(() => {
    const initMaps = async () => {
      try {
        // @ts-expect-error google is not typed
        if (window.google?.maps?.importLibrary) {
          // @ts-expect-error google is not typed
          await window.google.maps.importLibrary('maps');
          // @ts-expect-error google is not typed
          await window.google.maps.importLibrary('marker');
        }
      } catch (e) {
        console.error('Failed to load Google Maps libraries', e);
      }
    };
    initMaps();
  }, []);

  const [activities, setActivities] = useState(initialActivities);
  const [isGeneratingDay, setIsGeneratingDay] = useState(false);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [newActivityImage, setNewActivityImage] = useState<string | null>(null);
  const [showRoute, setShowRoute] = useState(false);

  const dayActivities = activities.filter(a => a.day === activeDay);

  const handleReorder = (newOrder: Activity[]) => {
    // Preserve activities from other days, and append the newly sorted dayActivities
    setActivities(prev => {
      const otherDays = prev.filter(a => a.day !== activeDay);
      return [...otherDays, ...newOrder];
    });
  };

  const handleAutoFillDay = () => {
    setIsGeneratingDay(true);
    setTimeout(() => {
      const newActivities: Activity[] = [
        { id: Date.now(), time: '09:00 AM', title: 'Meiji Shrine Morning Walk', type: 'activity', duration: 90, day: activeDay, votes: { up: 5, down: 0 }, comments: [{ id: 801, user: 'AI Assistant', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ai', text: 'Best visited early to avoid the crowds.', time: 'Just now' }] },
        { id: Date.now() + 1, time: '11:00 AM', title: 'Harajuku Takeshita Street', type: 'shopping', duration: 120, day: activeDay, votes: { up: 3, down: 1 }, comments: [] },
        { id: Date.now() + 2, time: '01:00 PM', title: 'Lunch at Harajuku Gyozaro', type: 'food', duration: 60, day: activeDay, votes: { up: 8, down: 0 }, comments: [{ id: 802, user: 'Alex M.', avatar: 'https://i.pravatar.cc/150?u=3', text: 'Their pan-fried gyoza are legendary!', time: 'Just now' }] },
        { id: Date.now() + 3, time: '03:00 PM', title: 'Omotesando Architecture Tour', type: 'activity', duration: 120, day: activeDay, votes: { up: 2, down: 0 }, comments: [] }
      ];
      setActivities(prev => [...prev, ...newActivities]);
      setIsGeneratingDay(false);
    }, 2500);
  };

  const getIconForType = (type: string) => {
    switch(type) {
      case 'flight': return <Plane size={18} />;
      case 'hotel': return <Hotel size={18} />;
      case 'food': return <Utensils size={18} />;
      case 'activity': return <Camera size={18} />;
      case 'shopping': return <ShoppingBag size={18} />;
      default: return <MapPin size={18} />;
    }
  };

  const getStatusBadgeIcon = (status: string) => {
    switch(status) {
      case 'Booked': return <CheckCircle2 size={12} />;
      case 'Must Do': return <Sparkles size={12} />;
      case 'Optional': return <AlertCircle size={12} />;
      default: return null;
    }
  };

  const getTransitIcon = (method: string) => {
    switch(method) {
      case 'walk': return <Footprints size={14} />;
      case 'train': return <Train size={14} />;
      default: return <Map size={14} />;
    }
  };

  return (
    <motion.div
      className="itinerary-container"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
    >
      <div className="itinerary-header">
        <div>
          <h2>Japan Circuit Itinerary</h2>
          <p className="text-secondary">Drag and drop to reschedule your days</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button
            variant="secondary"
            icon={<Sparkles size={16} />}
            onClick={() => setIsSuggestionsOpen(true)}
          >
            AI Suggestions
          </Button>
          <Button icon={<Plus size={16} />} onClick={() => setIsAddActivityOpen(true)}>Add Activity</Button>
        </div>
      </div>

      <div className="itinerary-content-split">
        {/* Left Panel: Scrollable List */}
        <div className="itinerary-left-panel">

          <div className="sticky-days-scroller">
            <div className="days-navigation">
        {days.map((day, idx) => (
          <button
            key={idx}
            className={`day-tab ${activeDay === idx ? 'active' : ''}`}
            onClick={() => setActiveDay(idx)}
          >
            {day}
          </button>
        ))}
      </div>
          </div>

      <div className="timeline-container">
        <div className="timeline-line"></div>

        <Reorder.Group
          axis="y"
          values={dayActivities}
          onReorder={handleReorder}
          className="reorder-timeline"
        >
        {dayActivities.map((activity, index) => {
          const isExpanded = expandedActivity === activity.id;
          // Mocking the live indicator on the second item of Day 0 for demonstration
          const isLiveNow = activeDay === 0 && index === 1;

          return (
          <Reorder.Item
            key={activity.id}
            value={activity}
            className="timeline-item"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
          >
            {isLiveNow && <div className="live-time-indicator"></div>}
            <div className={`duration-bar type-${activity.type}`} style={{ height: `${Math.max(60, activity.duration * 0.8)}px` }}></div>
            <div className="timeline-time">{activity.time}</div>
            <div className="timeline-node">
              <div className="node-icon">{getIconForType(activity.type)}</div>
            </div>

            <Card className={`timeline-content-card ${isExpanded ? 'expanded' : ''}`} onClick={() => setExpandedActivity(isExpanded ? null : activity.id)}>
              {activity.imageUrl && (
                <div className="activity-card-image" style={{ backgroundImage: `url(${activity.imageUrl})` }}></div>
              )}
              {activity.status && (
                <div className={`status-badge badge-${activity.status.replace(/\s+/g, '-').toLowerCase()}`}>
                  {getStatusBadgeIcon(activity.status)} {activity.status}
                </div>
              )}
              <CardContent className="timeline-card-inner">
                <div className="activity-info">
                  <h4 className="activity-title">{activity.title}</h4>
                  <div className="activity-duration">{activity.duration} minutes</div>
                </div>
                <div className="activity-actions">
                  <div className="interaction-stats">
                    <Button variant="ghost" size="sm" className="vote-btn" onClick={(e) => { e.stopPropagation(); setIsSuggestionsOpen(true); }} title="AI Insights">
                      <Sparkles size={14} className="text-accent" style={{marginRight: '4px'}}/> Insight
                    </Button>
                    <span><ThumbsUp size={14} /> {activity.votes.up}</span>
                    <span><MessageSquare size={14} /> {activity.comments.length}</span>
                  </div>
                </div>
              </CardContent>
              {/* Expansion Panel for Discussion */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="activity-discussion-panel"
                  >
                    <div className="expansion-actions" style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                      <Button size="sm" variant="ghost" className="vote-btn active"><ThumbsUp size={16} /> {activity.votes.up}</Button>
                      <Button size="sm" variant="ghost" className="vote-btn"><ThumbsDown size={16} /> {activity.votes.down}</Button>
                      <div style={{ flex: 1 }}></div>
                      <Button size="sm" variant="secondary" icon={<Camera size={14} />}>Add Photo</Button>
                    </div>

                    <div className="comments-section">
                      {activity.comments.length > 0 ? (
                        <div className="comments-list">
                          {activity.comments.map(comment => (
                            <div key={comment.id} className="comment-item">
                              <img src={comment.avatar} alt="" className="comment-avatar" />
                              <div className="comment-body">
                                <strong>{comment.user}</strong> <span className="comment-time">{comment.time}</span>
                                <p>{comment.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="no-comments">No comments yet. Start the discussion!</p>
                      )}
                      <div className="comment-input-area">
                        <img src="https://i.pravatar.cc/150?u=1" alt="You" className="comment-avatar" />
                        <input type="text" placeholder="Add a comment..." className="glass-input full-width-input" onClick={(e) => e.stopPropagation()}/>
                        <button className="send-btn" onClick={(e) => e.stopPropagation()}><Send size={14}/></button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>

            {/* Transit Connector between items */}
            {activity.transitToNext && (
              <div className="transit-connector">
                <div className="transit-line"></div>
                <div className="transit-pill">
                  {getTransitIcon(activity.transitToNext.method)}
                  <span>{activity.transitToNext.duration}m {activity.transitToNext.method}</span>
                </div>
                <div className="inline-add-btn" title="Add activity here">
                  <Plus size={14} strokeWidth={3} />
                </div>
              </div>
            )}
          </Reorder.Item>
          )
        })}
        </Reorder.Group>

        {isGeneratingDay ? (
          <div className="generating-day-state">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="magic-wand-spinner">
              <Sparkles size={48} color="var(--accent-primary)" />
            </motion.div>
            <h3 className="gradient-text">AI is crafting your perfect sequence...</h3>
            <p className="text-secondary">Analyzing local transit times and crowd patterns.</p>

            <div className="skeleton-timeline">
              <div className="skeleton-item"><div className="skel-icon"></div><div className="skel-card"></div></div>
              <div className="skeleton-item"><div className="skel-icon"></div><div className="skel-card half"></div></div>
              <div className="skeleton-item"><div className="skel-icon"></div><div className="skel-card"></div></div>
            </div>
          </div>
        ) : dayActivities.length === 0 ? (
          <div className="empty-day-state">
            <div className="empty-icon"><Compass size={48} /></div>
            <h3>Nothing planned yet</h3>
            <p>Use AI to quickly build a smart itinerary for this day, or add locations manually.</p>
            <Button
              className="mt-4 magic-wand-btn"
              size="md"
              icon={<Sparkles size={16} />}
              onClick={handleAutoFillDay}
            >
              Auto-fill {days[activeDay]}
            </Button>
          </div>
        ) : null}
          </div>
        </div>

        {/* Right Panel: Persistent Map */}
        <div className="itinerary-right-panel">
          <div className="map-wrapper">
            <div
              className="map-controls-overlay"
              style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}
            >
              <Button
                variant={showRoute ? 'primary' : 'secondary'}
                size="sm"
                icon={<Compass size={16} />}
                onClick={() => setShowRoute(!showRoute)}
                style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
              >
                {showRoute ? 'Hide Route' : 'Visualize Route'}
              </Button>
            </div>

            {showRoute && (
              <svg
                className="route-svg-overlay"
                preserveAspectRatio="none"
                viewBox="0 0 100 100"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 5, pointerEvents: 'none' }}
              >
                <motion.path
                  d="M 50,40 C 60,45 65,60 55,70 C 45,80 30,75 40,60"
                  fill="none"
                  stroke="var(--accent-primary)"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  style={{ filter: 'drop-shadow(0 0 4px var(--accent-glow))' }}
                />
              </svg>
            )}

            <ErrorBoundary>
              <GmpMap
                center="35.6812,139.7671" /* default to tokyo */
                zoom="11"
                map-id="DEMO_MAP_ID"
                style={{ width: '100%', height: '100%', border: 'none', borderRadius: '16px' }}
              >
                 {dayActivities.map(activity => {
                   // Mocking some positions for the markers
                   let pos = "35.6812,139.7671";
                   if (activity.title.includes('Shinjuku')) pos = "35.6938,139.7034";
                   if (activity.title.includes('Tsukiji')) pos = "35.6654,139.7706";
                   if (activity.title.includes('Narita')) pos = "35.7720,140.3929";
                   if (activity.title.includes('TeamLab')) pos = "35.6499,139.7891";
                   if (activity.title.includes('Harajuku')) pos = "35.6700,139.7028";
                   if (activity.title.includes('Meiji')) pos = "35.6764,139.6993";

                   return (
                     <GmpAdvancedMarker
                       key={activity.id}
                       position={pos}
                       title={activity.title}
                       className={expandedActivity === activity.id ? 'active-marker' : ''}
                     />
                   )
                 })}
              </GmpMap>
            </ErrorBoundary>

            {/* Overlay Gradient for aesthetics */}
            <div className="map-vignette-overlay"></div>
          </div>
        </div>
      </div>

      <AISuggestionsPanel
        isOpen={isSuggestionsOpen}
        onClose={() => setIsSuggestionsOpen(false)}
        day={days[activeDay]}
      />

      {/* Add Activity Modal overlay (Simplified version for demo) */}
      <AnimatePresence>
        {isAddActivityOpen && (
          <motion.div
            className="wizard-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => setIsAddActivityOpen(false)}
          >
            <motion.div
              className="wizard-container"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{ background: 'var(--bg-base)', padding: '32px', borderRadius: '16px', width: '100%', maxWidth: '500px', boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }}
            >
              <h2 style={{marginTop: 0, marginBottom: '24px'}}>Add Activity to {days[activeDay]}</h2>
              <div style={{display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)'}}>Activity Title</label>
                  <input type="text" className="glass-input full-width-input" placeholder="e.g., Visit Tokyo Tower" style={{width: '100%', padding: '12px'}} />
                </div>
                <div style={{display: 'flex', gap: '16px'}}>
                  <div style={{flex: 1}}>
                    <label style={{display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)'}}>Time</label>
                    <input type="time" className="glass-input full-width-input" style={{width: '100%', padding: '12px'}} />
                  </div>
                  <div style={{flex: 1}}>
                    <label style={{display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)'}}>Type</label>
                    <select className="glass-input full-width-input" style={{width: '100%', padding: '12px', appearance: 'auto'}}>
                      <option>Sightseeing</option>
                      <option>Food & Dining</option>
                      <option>Transport</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)'}}>Cover Image</label>
                  {newActivityImage ? (
                    <div style={{ position: 'relative', width: '100%', height: '140px', borderRadius: '8px', overflow: 'hidden', backgroundImage: `url(${newActivityImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                      <Button variant="ghost" size="sm" style={{position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.5)', color: 'white'}} onClick={() => setNewActivityImage(null)}>Remove</Button>
                    </div>
                  ) : (
                    <div style={{ border: '2px dashed var(--border-subtle)', borderRadius: '8px', padding: '24px', textAlign: 'center', cursor: 'pointer' }} onClick={() => setNewActivityImage('https://images.unsplash.com/photo-1542051812871-75f2c24f2b18?q=80&w=800&auto=format&fit=crop')}>
                      <Camera size={24} style={{ margin: '0 auto 8px', color: 'var(--text-secondary)' }} />
                      <div style={{fontSize: '0.9rem'}}>Click to browse photos</div>
                      <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Simulated upload</div>
                    </div>
                  )}
                </div>
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '12px'}}>
                <Button variant="ghost" onClick={() => setIsAddActivityOpen(false)}>Cancel</Button>
                <Button onClick={() => setIsAddActivityOpen(false)}>Add Activity</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
