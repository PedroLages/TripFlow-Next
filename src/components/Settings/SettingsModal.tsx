"use client"

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Bell, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import './SettingsModal.css';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="settings-overlay glass-panel"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
        >
          <motion.div
            className="settings-modal"
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            style={{ width: '100%', maxWidth: '600px', background: 'var(--bg-base)', borderRadius: '16px', border: '1px solid var(--border-subtle)', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '85vh' }}
          >
            <div className="settings-header" style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Global Settings</h2>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onClose}
                aria-label="Close settings"
              >
                <X size={20} />
              </Button>
            </div>

            <div className="settings-content" style={{ padding: '0', overflowY: 'auto' }}>
              <div className="settings-section" style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)' }}>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Globe size={16} /> Regional Preferences
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', color: 'var(--text-primary)' }}>Default Currency</label>
                    <select className="glass-input full-width-input" defaultValue="USD" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
                      <option value="USD">USD ($) - US Dollar</option>
                      <option value="EUR">EUR (€) - Euro</option>
                      <option value="JPY">JPY (¥) - Japanese Yen</option>
                      <option value="GBP">GBP (£) - British Pound</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', color: 'var(--text-primary)' }}>Language</label>
                    <select className="glass-input full-width-input" defaultValue="EN" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
                      <option value="EN">English (US)</option>
                      <option value="ES">Español</option>
                      <option value="JA">日本語 (Japanese)</option>
                      <option value="FR">Français</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="settings-section" style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)' }}>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Bell size={16} /> Notifications & Alerts
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 500 }}>Push Notifications</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Receive alerts for new comments and votes</div>
                    </div>
                    <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)' }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 500 }}>Quiet Hours</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Mute non-urgent alerts from 10 PM to 7 AM</div>
                    </div>
                    <input type="checkbox" style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)' }} />
                  </div>
                </div>
              </div>

              <div className="settings-section" style={{ padding: '24px 32px' }}>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={16} /> Privacy
                </h3>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 500 }}>Share Analytics</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Help improve TripFlow by sharing anonymous usage data</div>
                  </div>
                  <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)' }} />
                </div>
              </div>
            </div>

            <div className="settings-footer" style={{ padding: '24px 32px', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button onClick={onClose}>Save Changes</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
