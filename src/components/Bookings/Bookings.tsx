"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Bookings.css';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plane, Hotel, Ticket, Calendar, Search, Filter, ExternalLink, CheckCircle2, Clock } from 'lucide-react';

const mockBookings = [
  {
    id: 1,
    type: 'flight',
    title: 'ANA Flight NH8 - Outbound',
    provider: 'All Nippon Airways',
    reference: 'X7BY9Q',
    status: 'confirmed',
    date: 'Oct 12, 2026',
    time: '09:00 AM - 02:30 PM (+1)',
    destination: 'NRT (Tokyo Narita)'
  },
  {
    id: 2,
    type: 'hotel',
    title: 'Shinjuku Prince Hotel',
    provider: 'Booking.com',
    reference: '382910482',
    status: 'confirmed',
    date: 'Oct 13 - Oct 18, 2026',
    time: 'Check-in: 3:00 PM',
    destination: 'Shinjuku, Tokyo'
  },
  {
    id: 3,
    type: 'activity',
    title: 'TeamLab Planets Tokyo',
    provider: 'Klook',
    reference: 'KLK-88221AA',
    status: 'pending',
    date: 'Oct 15, 2026',
    time: '11:00 AM - 01:00 PM',
    destination: 'Toyosu, Tokyo'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 24
    }
  }
};

export const Bookings: React.FC = () => {
  const [filter, setFilter] = useState('all');

  const filteredBookings = filter === 'all'
    ? mockBookings
    : mockBookings.filter(b => b.type === filter);

  const getIcon = (type: string) => {
    switch (type) {
      case 'flight': return <Plane size={20} />;
      case 'hotel': return <Hotel size={20} />;
      case 'activity': return <Ticket size={20} />;
      default: return <Calendar size={20} />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle2 size={16} className="text-success" />;
      case 'pending': return <Clock size={16} className="text-warning" />;
      default: return null;
    }
  };

  return (
    <motion.div
      className="bookings-container"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bookings-header">
        <div>
          <h2>Your Bookings</h2>
          <p className="text-secondary">Keep track of flights, hotels, and activities in one place.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="secondary">
            <Filter size={16} />
            Filter
          </Button>
          <Button>
            <Search size={16} />
            Sync from Email
          </Button>
        </div>
      </div>

      <div className="bookings-filter-tabs">
        <button
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`filter-tab ${filter === 'flight' ? 'active' : ''}`}
          onClick={() => setFilter('flight')}
        >
          Flights
        </button>
        <button
          className={`filter-tab ${filter === 'hotel' ? 'active' : ''}`}
          onClick={() => setFilter('hotel')}
        >
          Hotels
        </button>
        <button
          className={`filter-tab ${filter === 'activity' ? 'active' : ''}`}
          onClick={() => setFilter('activity')}
        >
          Activities
        </button>
      </div>

      <motion.div
        className="bookings-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        key={filter} // re-trigger animation on filter change
      >
        {filteredBookings.map((booking) => (
          <motion.div key={booking.id} variants={itemVariants}>
            <Card className="booking-card glass-panel interactive-hover">
              <CardContent className="booking-card-content">
                <div className="booking-type-icon">
                  {getIcon(booking.type)}
                </div>

                <div className="booking-details">
                  <div className="booking-header-row">
                    <h3 className="booking-title">{booking.title}</h3>
                    <div className={`booking-status-badge ${booking.status}`}>
                      {getStatusIcon(booking.status)}
                      <span>{booking.status}</span>
                    </div>
                  </div>

                  <div className="booking-sub-details">
                    <div className="detail-item">
                      <span className="detail-label">Provider:</span>
                      <span className="detail-value">{booking.provider}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Ref:</span>
                      <span className="detail-value highlight">{booking.reference}</span>
                    </div>
                  </div>

                  <div className="booking-logistics">
                    <div className="logistic-row">
                      <Calendar size={14} className="text-secondary" />
                      <span>{booking.date} &bull; {booking.time}</span>
                    </div>
                    <div className="logistic-row">
                      <Plane size={14} className="text-secondary" />
                      <span>{booking.destination}</span>
                    </div>
                  </div>
                </div>

                <div className="booking-actions">
                  <Button variant="ghost" size="sm">
                    <ExternalLink size={14} />
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {filteredBookings.length === 0 && (
          <motion.div variants={itemVariants} className="empty-bookings-state">
            <Ticket size={48} className="empty-icon" />
            <h3>No {filter !== 'all' ? filter : ''} bookings found</h3>
            <p className="text-secondary">Sync your email to automatically import reservations.</p>
          </motion.div>
        )}
      </motion.div>

    </motion.div>
  );
};
