"use client"

import React, { useRef, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Map, CheckSquare, Lock, CloudRain, Sun, Clock, Crown, ListTodo, CheckCircle2, Circle, Plus } from 'lucide-react';
import { Card } from '../ui/Card';
import './TripDetail.css';

interface TripDetailProps {
  trip: {
    destination: string;
    dates: string;
    status: string;
    progress: number;
    imageUrl: string;
    collaborators: number;
    accentColor: string;
  };
}

export const TripDetail: React.FC<TripDetailProps> = ({ trip }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { tripId } = useParams<{ tripId: string }>();

  // Mock tasks state
  const [tasks, setTasks] = useState([
    { id: 't1', title: 'Book bullet train to Kyoto', assignee: 'https://i.pravatar.cc/100?img=33', completed: false },
    { id: 't2', title: 'Confirm Airbnb reservation', assignee: 'https://i.pravatar.cc/100?img=47', completed: true },
    { id: 't3', title: 'Buy Universal Studios passes', completed: false }
  ]);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  // Calculate real countdown from trip dates
  const daysUntilTrip = useMemo(() => {
    if (!trip.dates) return null;
    const monthMap: Record<string, number> = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    };
    // Parse "Oct 12 - Oct 26, 2026" format
    const match = trip.dates.match(/(\w+)\s+(\d+)\s*-\s*\w+\s+\d+,\s*(\d+)/);
    if (!match) return null;
    const [, monthStr, dayStr, yearStr] = match;
    const startDate = new Date(parseInt(yearStr), monthMap[monthStr], parseInt(dayStr));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = startDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, [trip.dates]);

  // Task input handler
  const handleAddTask = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const input = e.currentTarget;
      const title = input.value.trim();
      if (title) {
        setTasks(prev => [...prev, { id: `t${Date.now()}`, title, completed: false }]);
        input.value = '';
      }
    }
  };

  // Parallax calculations
  const { scrollYProgress } = useScroll({
    container: containerRef
  });

  const yImage = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacityOverlay = useTransform(scrollYProgress, [0, 1], [0.2, 0.8]);
  const yContent = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <motion.div
      className="trip-detail-voyage"
      ref={containerRef}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      {/* Hero Parallax Section */}
      <div className="td-hero-sandbox">
        <div className="td-hero-image-container">
          <motion.div
            className="td-hero-image"
            style={{
              backgroundImage: `url(${trip.imageUrl})`,
              y: yImage
            }}
          />
          <motion.div
            className="td-hero-overlay"
            style={{ opacity: opacityOverlay }}
          />

          <div className="td-countdown-center">
            <motion.div variants={itemVariants} className="td-countdown-container">
              <span className="td-cd-label">TRIP COUNTDOWN</span>
              <div className="td-cd-value">{daysUntilTrip !== null ? daysUntilTrip : '—'} <span>{daysUntilTrip === 1 ? 'Day' : 'Days'}</span></div>
              <div className="td-cd-dates">{trip.dates}</div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Cinematic Content Section */}
      <motion.div className="td-content-layer" style={{ y: yContent }}>
        {/* Stat Widgets */}
        <div className="td-stats-row">
           <Link href={`/trips/${tripId}/voting`} style={{ textDecoration: 'none' }}>
             <Card className="td-small-stat" role="link" tabIndex={0}>
                <CheckSquare size={20} color="var(--color-purple)" aria-hidden="true" />
                <div className="stat-text">
                  <strong>3</strong>
                  <span>Active Polls</span>
                </div>
             </Card>
           </Link>
           <Link href={`/trips/${tripId}/budget`} style={{ textDecoration: 'none' }}>
             <Card className="td-small-stat" role="link" tabIndex={0}>
                <Lock size={20} color="var(--color-green)" aria-hidden="true" />
                <div className="stat-text">
                  <strong>Locked</strong>
                  <span>Budget Status</span>
                </div>
             </Card>
           </Link>
           <Link href={`/trips/${tripId}/itinerary`} style={{ textDecoration: 'none' }}>
             <Card className="td-small-stat" role="link" tabIndex={0}>
                <Map size={20} color="var(--color-blue)" aria-hidden="true" />
                <div className="stat-text">
                  <strong>5</strong>
                  <span>Confirmed Spots</span>
                </div>
             </Card>
           </Link>
        </div>

        {/* Modular Grid */}
        <div className="td-widgets-grid">
           {/* Left Column: Tasks & Activity (wider) */}
           <div className="td-widget-col tdw-left">
              {/* Tasks & Checklists Widget */}
              <Card className="td-widget-card tasks-widget">
                 <div className="widget-header">
                   <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                     <ListTodo size={16} color="var(--text-secondary)" aria-hidden="true" /> <h3>Tasks &amp; Checklists</h3>
                   </div>
                   <span className="widget-meta">{tasks.filter(t => t.completed).length}/{tasks.length} Done</span>
                 </div>
                 <div className="widget-content pad-body">
                    {tasks.map(task => (
                      <div
                        key={task.id}
                        className={`task-item ${task.completed ? 'completed' : ''}`}
                        role="checkbox"
                        aria-checked={task.completed}
                        aria-label={`${task.title}${task.completed ? ' (completed)' : ''}`}
                        tabIndex={0}
                        onClick={() => toggleTask(task.id)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleTask(task.id); } }}
                      >
                         <span className="task-checkbox" aria-hidden="true">
                           {task.completed ? <CheckCircle2 size={18} color="var(--color-green)" /> : <Circle size={18} color="var(--text-tertiary)" />}
                         </span>
                         <span className="task-title">{task.title}</span>
                         {task.assignee && (
                           <img
                             className="task-assignee"
                             src={task.assignee}
                             alt="Assigned team member"
                             width={24}
                             height={24}
                             loading="lazy"
                           />
                         )}
                      </div>
                    ))}

                    <div className="task-add-row">
                      <Plus size={16} color="var(--text-tertiary)" aria-hidden="true" />
                      <input
                        type="text"
                        placeholder="Add a new task..."
                        className="task-input"
                        aria-label="Add a new task"
                        onKeyDown={handleAddTask}
                      />
                    </div>
                 </div>
              </Card>

              <Card className="td-widget-card activity-feed-widget" style={{ marginTop: '24px' }}>
                 <div className="widget-header">
                   <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                     <Clock size={16} color="var(--text-secondary)" aria-hidden="true" /> <h3>Recent Activity</h3>
                   </div>
                   <button className="widget-link" type="button" aria-label="View all activity">View All</button>
                 </div>
                 <div className="widget-content pad-body">
                    <div className="activity-item">
                       <div className="activity-dot purple" aria-hidden="true"></div>
                       <div className="activity-text">
                          <span className="time">2h ago</span>
                          <p><span className="activity-type-label vote">Vote</span> <strong>Sarah J</strong> voted on <strong>Accommodation Preference</strong></p>
                       </div>
                    </div>
                    <div className="activity-item">
                       <div className="activity-dot blue" aria-hidden="true"></div>
                       <div className="activity-text">
                          <span className="time">5h ago</span>
                          <p><span className="activity-type-label suggestion">Suggestion</span> <strong>Mike T</strong> suggested Kichi Kichi Omurice</p>
                       </div>
                    </div>
                    <div className="activity-item">
                       <div className="activity-dot green" aria-hidden="true"></div>
                       <div className="activity-text">
                          <span className="time">1d ago</span>
                          <p><span className="activity-type-label budget">Budget</span> <strong>Alex Chen</strong> locked Blind Budget</p>
                       </div>
                    </div>
                     <div className="activity-item">
                       <div className="activity-dot" aria-hidden="true"></div>
                       <div className="activity-text">
                          <span className="time">1d ago</span>
                          <p><span className="activity-type-label comment">Comment</span> <strong>Sarah J</strong> commented on <strong>Day 2 Itinerary</strong></p>
                       </div>
                    </div>
                 </div>
              </Card>
           </div>

           {/* Right Column: Team & Weather */}
           <div className="td-widget-col tdw-right">
              <Card className="td-widget-card readiness-widget">
                 <div className="widget-header">
                   <h3>Team Readiness</h3>
                   <span className="widget-meta">{trip.collaborators} Members</span>
                 </div>
                 <div className="widget-content">
                    <div className="readiness-item">
                       <img className="r-avatar" src="https://i.pravatar.cc/100?img=33" alt="Alex Chen" width={40} height={40} loading="lazy" />
                       <div className="r-info">
                          <strong>Alex Chen</strong>
                          <span>Member</span>
                       </div>
                       <div className="r-status"><CheckSquare size={16} color="var(--color-green)" aria-label="Ready" /></div>
                    </div>
                    <div className="readiness-item">
                       <div className="r-avatar" style={{backgroundImage: 'url(https://i.pravatar.cc/100?img=47)', position: 'relative'}}>
                         <div className="owner-badge"><Crown size={10} color="white" aria-hidden="true" /></div>
                       </div>
                       <div className="r-info">
                          <strong>Jessica L.</strong>
                          <span>Owner</span>
                       </div>
                       <div className="r-status"><CheckSquare size={16} color="var(--color-green)" aria-label="Ready" /></div>
                    </div>
                    <div style={{padding: '16px'}}>
                      <button className="invite-btn" style={{ width: '100%', padding: '8px 16px', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-subtle)', background: 'transparent', color: 'var(--text-secondary)', fontSize: '0.85rem', cursor: 'pointer' }} aria-label="Invite a friend to this trip">+ Invite Friend</button>
                    </div>
                 </div>
              </Card>

              <Card className="td-widget-card weather-widget blue-gradient">
                 <div className="widget-header weather-header">
                    <h3>Weather Forecast</h3>
                    <CloudRain size={20} color="white" aria-hidden="true" />
                 </div>
                 <div className="weather-content">
                   <p className="weather-location">{trip.destination}</p>
                   <div className="weather-main">
                      <h2>18°</h2>
                      <span>Partly Cloudy</span>
                   </div>
                   <div className="weather-forecast-row" role="list" aria-label="4-day weather forecast">
                      <div className="w-day" role="listitem"><span>Mon</span><Sun size={14} aria-label="Sunny" /></div>
                      <div className="w-day" role="listitem"><span>Tue</span><CloudRain size={14} aria-label="Rainy" /></div>
                      <div className="w-day" role="listitem"><span>Wed</span><Sun size={14} aria-label="Sunny" /></div>
                      <div className="w-day" role="listitem"><span>Thu</span><Sun size={14} aria-label="Sunny" /></div>
                   </div>
                 </div>
              </Card>
           </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
