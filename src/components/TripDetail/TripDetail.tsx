"use client"

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Map, CheckSquare, Lock, CloudRain, Sun, Clock, Crown, ListTodo, CheckCircle2, Circle, Plus } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/ButtonLegacy';
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

  // Mock tasks state
  const [tasks, setTasks] = useState([
    { id: 't1', title: 'Book bullet train to Kyoto', assignee: 'https://i.pravatar.cc/100?img=33', completed: false },
    { id: 't2', title: 'Confirm Airbnb reservation', assignee: 'https://i.pravatar.cc/100?img=47', completed: true },
    { id: 't3', title: 'Buy Universal Studios passes', completed: false }
  ]);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
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
              <div className="td-cd-value">24 <span>Days</span></div>
              <div className="td-cd-dates">{trip.dates}</div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Cinematic Content Section */}
      <motion.div className="td-content-layer" style={{ y: yContent }}>
        {/* Stat Widgets */}
        <div className="td-stats-row">
           <Card className="td-small-stat">
              <CheckSquare size={20} color="var(--color-purple)" />
              <div className="stat-text">
                <strong>3</strong>
                <span>Active Polls</span>
              </div>
           </Card>
           <Card className="td-small-stat">
              <Lock size={20} color="var(--color-green)" />
              <div className="stat-text">
                <strong>Locked</strong>
                <span>Budget Status</span>
              </div>
           </Card>
           <Card className="td-small-stat">
              <Map size={20} color="var(--color-blue)" />
              <div className="stat-text">
                <strong>5</strong>
                <span>Confirmed Spots</span>
              </div>
           </Card>
        </div>

        {/* Modular Grid */}
        <div className="td-widgets-grid">
           {/* Left Column: Recent Activity */}
           <div className="td-widget-col tdw-left">
              <Card className="td-widget-card activity-feed-widget">
                 <div className="widget-header">
                   <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                     <Clock size={16} color="var(--text-secondary)" /> <h3>Recent Activity</h3>
                   </div>
                   <span className="widget-link">View All</span>
                 </div>
                 <div className="widget-content pad-body">
                    <div className="activity-item">
                       <div className="activity-dot purple"></div>
                       <div className="activity-text">
                          <span className="time">2h ago</span>
                          <p><strong>Sarah J</strong> voted on <strong>Accommodation Preference</strong></p>
                       </div>
                    </div>
                    <div className="activity-item">
                       <div className="activity-dot blue"></div>
                       <div className="activity-text">
                          <span className="time">5h ago</span>
                          <p><strong>Mike T</strong> suggested Kichi Kichi Omurice</p>
                       </div>
                    </div>
                    <div className="activity-item">
                       <div className="activity-dot green"></div>
                       <div className="activity-text">
                          <span className="time">1d ago</span>
                          <p><strong>Alex Chen</strong> locked Blind Budget</p>
                       </div>
                    </div>
                     <div className="activity-item">
                       <div className="activity-dot"></div>
                       <div className="activity-text">
                          <span className="time">1d ago</span>
                          <p><strong>Sarah J</strong> commented on <strong>Day 2 Itinerary</strong></p>
                       </div>
                    </div>
                 </div>
              </Card>
           </div>

           {/* Right Column: Readiness & Tasks & Weather */}
           <div className="td-widget-col tdw-right">
              {/* Tasks & Checklists Widget */}
              <Card className="td-widget-card tasks-widget">
                 <div className="widget-header">
                   <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                     <ListTodo size={16} color="var(--text-secondary)" /> <h3>Tasks & Checklists</h3>
                   </div>
                   <span className="widget-meta">{tasks.filter(t => t.completed).length}/{tasks.length} Done</span>
                 </div>
                 <div className="widget-content pad-body">
                    {tasks.map(task => (
                      <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`} onClick={() => toggleTask(task.id)}>
                         <button className="task-checkbox">
                           {task.completed ? <CheckCircle2 size={18} color="var(--color-green)" /> : <Circle size={18} color="var(--text-tertiary)" />}
                         </button>
                         <span className="task-title">{task.title}</span>
                         {task.assignee && (
                           <div className="task-assignee" style={{ backgroundImage: `url(${task.assignee})` }} title="Assigned"></div>
                         )}
                      </div>
                    ))}

                    <div className="task-add-row">
                      <Plus size={16} color="var(--text-tertiary)" />
                      <input type="text" placeholder="Add a new task..." className="task-input" />
                    </div>
                 </div>
              </Card>

              <Card className="td-widget-card readiness-widget">
                 <div className="widget-header">
                   <h3>Team Readiness</h3>
                   <span className="widget-meta">{trip.collaborators} Members</span>
                 </div>
                 <div className="widget-content">
                    <div className="readiness-item">
                       <div className="r-avatar" style={{backgroundImage: 'url(https://i.pravatar.cc/100?img=33)'}}></div>
                       <div className="r-info">
                          <strong>Alex Chen</strong>
                          <span>Member</span>
                       </div>
                       <div className="r-status"><CheckSquare size={16} color="var(--color-green)" /></div>
                    </div>
                    <div className="readiness-item">
                       <div className="r-avatar" style={{backgroundImage: 'url(https://i.pravatar.cc/100?img=47)'}}>
                         <div className="owner-badge"><Crown size={10} color="white" /></div>
                       </div>
                       <div className="r-info">
                          <strong>Jessica L.</strong>
                          <span>Owner</span>
                       </div>
                       <div className="r-status"><CheckSquare size={16} color="var(--color-green)" /></div>
                    </div>
                    <div style={{padding: '16px'}}>
                      <Button variant="ghost" className="invite-btn" size="sm" fullWidth>+ Invite Friend</Button>
                    </div>
                 </div>
              </Card>

              <Card className="td-widget-card weather-widget blue-gradient">
                 <div className="widget-header weather-header">
                    <h3>Weather Forecast</h3>
                    <CloudRain size={20} color="white" />
                 </div>
                 <div className="weather-content">
                   <p className="weather-location">{trip.destination}</p>
                   <div className="weather-main">
                      <h2>18°</h2>
                      <span>Partly Cloudy</span>
                   </div>
                   <div className="weather-forecast-row">
                      <div className="w-day"><span>Mon</span><Sun size={14}/></div>
                      <div className="w-day"><span>Tue</span><CloudRain size={14}/></div>
                      <div className="w-day"><span>Wed</span><Sun size={14}/></div>
                      <div className="w-day"><span>Thu</span><Sun size={14}/></div>
                   </div>
                 </div>
              </Card>
           </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
