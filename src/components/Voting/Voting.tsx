"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Check, Calendar, Home, MapPin, Users, Plus, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import './Voting.css';

interface VotingOption {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  price?: string;
  votes: string[]; // array of user names or avatars
  hasVoted?: boolean;
}

interface Poll {
  id: string;
  title: string;
  category: 'dates' | 'accommodation' | 'activity' | 'general';
  type: 'single' | 'approval' | 'ranked' | 'yesno';
  status: 'active' | 'resolved';
  author: string;
  deadline: string;
  options: VotingOption[];
}

const CURRENT_USER = 'Pedro';

const MOCK_POLLS: Poll[] = [
  {
    id: '1',
    title: 'Kyoto Accommodation',
    category: 'accommodation',
    type: 'ranked',
    status: 'active',
    author: 'Sarah',
    deadline: '2 days left',
    options: [
      {
        id: 'opt1',
        title: 'Traditional Ryokan',
        subtitle: 'Gion District • Authentic experience',
        price: '$250/night',
        imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600&auto=format&fit=crop',
        votes: ['Sarah', 'Alex', 'Pedro'],
        hasVoted: true
      },
      {
        id: 'opt2',
        title: 'Modern Hotel',
        subtitle: 'Downtown Kyoto • Near station',
        price: '$180/night',
        imageUrl: 'https://images.unsplash.com/photo-1542051812-ba2694dbfb01?q=80&w=600&auto=format&fit=crop',
        votes: ['Pedro', 'Sarah'],
        hasVoted: true
      },
      {
        id: 'opt3',
        title: 'Airbnb Machiya',
        subtitle: 'Higashiyama • Entire house',
        price: '$210/night',
        imageUrl: 'https://images.unsplash.com/photo-1610444697354-95493e839218?q=80&w=600&auto=format&fit=crop',
        votes: ['Alex'],
        hasVoted: false
      }
    ]
  },
  {
    id: '2',
    title: 'Travel Dates',
    category: 'dates',
    type: 'approval',
    status: 'active',
    author: 'Pedro',
    deadline: '1 day left',
    options: [
      { id: 'd1', title: 'Oct 12 - Oct 26', subtitle: 'Peak autumn leaves', votes: ['Pedro', 'Sarah', 'Alex'], hasVoted: true },
      { id: 'd2', title: 'Nov 2 - Nov 16', subtitle: 'Late autumn, slightly cooler', votes: ['Pedro'], hasVoted: true }
    ]
  },
  {
    id: '3',
    title: 'Tokyo Day Trip',
    category: 'activity',
    type: 'single',
    status: 'resolved',
    author: 'Alex',
    deadline: 'Ended',
    options: [
      { id: 'a1', title: 'Hakone Hot Springs', votes: ['Sarah', 'Pedro', 'Alex'], hasVoted: true },
      { id: 'a2', title: 'Nikko Shrines', votes: [], hasVoted: false }
    ]
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

export const Voting: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>(MOCK_POLLS);
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');
  const [isCreatingPoll, setIsCreatingPoll] = useState(false);
  const [newPollType, setNewPollType] = useState<'single' | 'approval' | 'ranked' | 'yesno'>('single');

  const handleVote = (pollId: string, optionId: string) => {
    setPolls(prevPolls => prevPolls.map(poll => {
      if (poll.id !== pollId) return poll;
      if (poll.status === 'resolved') return poll; // Cannot vote on resolved

      const updatedOptions = poll.options.map(opt => {
        let newVotes = opt.votes.filter(v => v !== CURRENT_USER);
        let hasVoted = false;

        // Logic based on voting type
        if (poll.type === 'single') {
          // Remove from all other options, add to this one
          if (opt.id === optionId) {
            if (!opt.hasVoted) {
              newVotes.push(CURRENT_USER);
              hasVoted = true;
            }
          }
        } else if (poll.type === 'approval' || poll.type === 'ranked') {
          // Toggle independently
          if (opt.id === optionId) {
            if (!opt.hasVoted) {
              newVotes.push(CURRENT_USER);
              hasVoted = true;
            } else {
              hasVoted = false;
            }
          } else {
            hasVoted = opt.hasVoted || false;
            newVotes = opt.votes;
          }
        }

        return { ...opt, votes: newVotes, hasVoted };
      });

      return { ...poll, options: updatedOptions };
    }));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'dates': return <Calendar size={18} className="text-blue" />;
      case 'accommodation': return <Home size={18} className="text-green" />;
      case 'activity': return <MapPin size={18} className="text-amber" />;
      default: return <Users size={18} />;
    }
  };

  const filteredPolls = polls.filter(p => filter === 'all' || p.status === filter);
  const activeCount = polls.filter(p => p.status === 'active').length;

  return (
    <motion.div
      className="voting-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0 }}
    >
      <div className="voting-header">
        <div className="voting-header-content">
          <h2 className="voting-title">Team Decisions</h2>
          <p className="voting-subtitle">Vote on dates, places, and activities to finalize the itinerary.</p>
        </div>
        {!isCreatingPoll && (
          <Button className="propose-btn" onClick={() => setIsCreatingPoll(true)}>
            <Plus size={18} />
            Propose Idea
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isCreatingPoll && (
          <motion.div
            className="create-poll-card"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="create-poll-content glass-panel" style={{ padding: '24px', borderRadius: '16px', marginBottom: '24px', border: '1px solid var(--border-subtle)' }}>
              <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Create New Poll</h3>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>What needs deciding?</label>
                <input type="text" className="poll-input full-width-input glass-input" placeholder="e.g. Which team building activity?" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }} />
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Type of Voting</label>
                <div className="voting-type-selector" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>

                  <div className={`type-btn ${newPollType === 'single' ? 'active' : ''}`} onClick={() => setNewPollType('single')} style={{ padding: '12px', borderRadius: '8px', border: `1px solid ${newPollType === 'single' ? 'var(--accent-primary)' : 'var(--border-subtle)'}`, background: newPollType === 'single' ? 'rgba(var(--accent-primary-rgb), 0.1)' : 'var(--bg-surface)', cursor: 'pointer', textAlign: 'center' }}>
                    <strong>Single Choice</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>One vote per person</div>
                  </div>

                  <div className={`type-btn ${newPollType === 'approval' ? 'active' : ''}`} onClick={() => setNewPollType('approval')} style={{ padding: '12px', borderRadius: '8px', border: `1px solid ${newPollType === 'approval' ? 'var(--accent-primary)' : 'var(--border-subtle)'}`, background: newPollType === 'approval' ? 'rgba(var(--accent-primary-rgb), 0.1)' : 'var(--bg-surface)', cursor: 'pointer', textAlign: 'center' }}>
                    <strong>Approval</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>Vote for all acceptable</div>
                  </div>

                  <div className={`type-btn ${newPollType === 'ranked' ? 'active' : ''}`} onClick={() => setNewPollType('ranked')} style={{ padding: '12px', borderRadius: '8px', border: `1px solid ${newPollType === 'ranked' ? 'var(--accent-primary)' : 'var(--border-subtle)'}`, background: newPollType === 'ranked' ? 'rgba(var(--accent-primary-rgb), 0.1)' : 'var(--bg-surface)', cursor: 'pointer', textAlign: 'center' }}>
                    <strong>Ranked Choice</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>Order by preference</div>
                  </div>

                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <Button variant="ghost" onClick={() => setIsCreatingPoll(false)}>Cancel</Button>
                <Button onClick={() => setIsCreatingPoll(false)}>Publish Poll</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="voting-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Polls
        </button>
        <button
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active <span className="badge-count">{activeCount}</span>
        </button>
        <button
          className={`filter-btn ${filter === 'resolved' ? 'active' : ''}`}
          onClick={() => setFilter('resolved')}
        >
          Resolved
        </button>
      </div>

      <div className="polls-grid">
        <AnimatePresence mode="popLayout">
          {filteredPolls.map((poll) => (
            <motion.div
              key={poll.id}
              variants={itemVariants}
              layout
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.95 }}
              className={`poll-card ${poll.status === 'resolved' ? 'resolved' : ''}`}
            >
              <div className="poll-card-header">
                <div className="poll-category-badge">
                  {getCategoryIcon(poll.category)}
                  <span style={{ textTransform: 'capitalize' }}>{poll.category}</span>
                </div>
                {poll.status === 'resolved' ? (
                  <div className="poll-status resolved-badge"><CheckCircle2 size={14} /> Resolved</div>
                ) : (
                  <div className="poll-status deadline">{poll.deadline}</div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 className="poll-question">{poll.title}</h3>
                <span className="poll-type-badge text-secondary" style={{ fontSize: '0.75rem', padding: '4px 8px', background: 'var(--bg-hover)', borderRadius: '100px', textTransform: 'capitalize' }}>
                  {poll.type} Voting
                </span>
              </div>
              <p className="poll-author">Proposed by {poll.author}</p>

              <div className="poll-options">
                {poll.options.map((option) => {
                  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes.length, 0);
                  const percent = totalVotes === 0 ? 0 : Math.round((option.votes.length / totalVotes) * 100);
                  const isWinning = poll.status === 'resolved' && option.votes.length > 0 && Math.max(...poll.options.map(o => o.votes.length)) === option.votes.length;

                  return (
                    <div
                      key={option.id}
                      className={`poll-option ${option.hasVoted ? 'voted' : ''} ${isWinning ? 'winning' : ''}`}
                      onClick={() => handleVote(poll.id, option.id)}
                    >
                      {/* Optional Image */}
                      {option.imageUrl && (
                        <div className="poll-option-image" style={{ backgroundImage: `url(${option.imageUrl})` }}>
                          {isWinning && <div className="winning-overlay"><CheckCircle2 size={32} /></div>}
                        </div>
                      )}

                      <div className="poll-option-content">
                        <div className="poll-option-info">
                          <div className="poll-option-title-row">
                            <span className="poll-option-title">{option.title}</span>
                            {option.price && <span className="poll-option-price">{option.price}</span>}
                          </div>
                          {option.subtitle && <span className="poll-option-subtitle">{option.subtitle}</span>}
                        </div>

                        <div className="poll-option-action">
                          {poll.type === 'ranked' && option.hasVoted ? (
                            <div className="rank-indicator" style={{ width: '24px', height: '24px', borderRadius: '12px', background: 'var(--accent-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                              #{option.votes.indexOf(CURRENT_USER) + 1 || 1}
                            </div>
                          ) : (
                            <div className={`vote-checkbox ${option.hasVoted ? 'checked' : ''} ${poll.type === 'approval' ? 'square' : ''}`}>
                              {option.hasVoted && <Check size={14} strokeWidth={3} />}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="poll-option-results">
                        <div className="progress-bar-bg">
                          <motion.div
                            className="progress-bar-fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                          />
                        </div>
                        <div className="vote-stats-row">
                          <div className="voter-avatars">
                            {option.votes.map((voter, i) => (
                              <div key={i} className="voter-avatar" title={voter} style={{ zIndex: 10 - i }}>
                                {voter.charAt(0)}
                              </div>
                            ))}
                          </div>
                          <span className="vote-percent">{percent}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
