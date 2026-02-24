"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Users, UserPlus, Settings2, MoreHorizontal, ShieldAlert, X, BellDot } from 'lucide-react';
import { Button } from '../ui/Button';
import './CollaborationPanel.css';

interface CollaborationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockUsers = [
  { id: 1, name: 'You (Pedro)', role: 'Owner', avatar: 'https://i.pravatar.cc/150?u=1', status: 'online' },
  { id: 2, name: 'Sarah J.', role: 'Editor', avatar: 'https://i.pravatar.cc/150?u=2', status: 'online' },
  { id: 3, name: 'Alex M.', role: 'Editor', avatar: 'https://i.pravatar.cc/150?u=3', status: 'offline' },
  { id: 4, name: 'Mom & Dad', role: 'Viewer', avatar: 'https://i.pravatar.cc/150?u=4', status: 'offline' },
];

export const CollaborationPanel: React.FC<CollaborationPanelProps> = ({ isOpen, onClose }) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Editor');

  const containerVariants: Variants = {
    hidden: { x: '100%', opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring', damping: 25, stiffness: 200 }
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
            className="collaboration-panel"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="panel-header">
              <div className="title-row">
                <h3><Users size={20} /> Trip Members (4)</h3>
                <button className="close-btn" onClick={onClose}><X size={20}/></button>
              </div>
              <p>Manage who can view and edit this trip.</p>
            </div>

            <div className="panel-content">
              {/* Invite Section */}
              <div className="invite-section">
                <h4>Invite Co-travelers</h4>
                <div className="invite-form">
                  <input
                    type="email"
                    placeholder="Email address..."
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="glass-input"
                  />
                  <div className="invite-form-actions">
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="glass-input role-select"
                    >
                      <option value="Editor">Editor</option>
                      <option value="Viewer">Viewer</option>
                    </select>
                    <Button size="sm"><UserPlus size={16} /> Invite</Button>
                  </div>
                </div>
                <div className="share-link-box">
                  <span className="link-text">tripflow.ai/invite/jp-2026-x9f2</span>
                  <Button variant="ghost" size="sm">Copy Link</Button>
                </div>
              </div>

              {/* Members List */}
              <div className="members-section">
                <h4>Current Members</h4>
                <div className="members-list">
                  {mockUsers.map(user => (
                    <div key={user.id} className="member-row">
                      <div className="member-avatar-wrapper">
                        <img src={user.avatar} alt={user.name} className="member-avatar" />
                        <div className={`status-indicator ${user.status}`}></div>
                      </div>

                      <div className="member-info">
                        <div className="member-name">
                          {user.name}
                          {user.role === 'Owner' && <ShieldAlert size={14} className="owner-badge" />}
                        </div>
                        <div className="member-role">{user.role}</div>
                      </div>

                      <button className="icon-btn">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Feed Snippet */}
              <div className="collab-activity-section">
                <h4><BellDot size={16}/> Live Updates</h4>
                <div className="mini-feed">
                  <div className="mini-feed-item">
                    <img src={mockUsers[1].avatar} alt="" />
                    <p><strong>Sarah J.</strong> added TeamLab Planets to Oct 15</p>
                    <span>Just now</span>
                  </div>
                  <div className="mini-feed-item">
                    <img src={mockUsers[1].avatar} alt="" />
                    <p><strong>Sarah J.</strong> voted 👍 on Sushi Dai</p>
                    <span>10 mins ago</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="panel-footer">
              <Button variant="ghost" fullWidth><Settings2 size={16} style={{marginRight: '8px'}}/> Advanced Permissions</Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
