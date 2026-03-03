"use client"

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { CITY_CONFIGS, type CitySlug } from '@/lib/city-colors';
import { Camera } from 'lucide-react';

interface AddActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayLabel: string;   // e.g. "Day 1 — Aug 27"
  citySlug: CitySlug;
}

export const AddActivityModal: React.FC<AddActivityModalProps> = ({ isOpen, onClose, dayLabel, citySlug }) => {
  const [newActivityImage, setNewActivityImage] = useState<string | null>(null);
  const config = CITY_CONFIGS[citySlug];
  const Icon = config.icon;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Activity</DialogTitle>
          <DialogDescription>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Icon size={14} style={{ color: `var(${config.cssVar})` }} />
              <span>{config.name} — {dayLabel}</span>
            </span>
          </DialogDescription>
        </DialogHeader>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Title */}
          <div>
            <label
              htmlFor="activity-title"
              style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}
            >
              Activity Title
            </label>
            <input
              id="activity-title"
              type="text"
              className="glass-input full-width-input"
              placeholder="e.g., Visit The Bund"
              style={{ width: '100%', padding: '12px' }}
            />
          </div>

          {/* Time + Type row */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label
                htmlFor="activity-time"
                style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}
              >
                Time
              </label>
              <input
                id="activity-time"
                type="time"
                className="glass-input full-width-input"
                style={{ width: '100%', padding: '12px' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label
                htmlFor="activity-type"
                style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}
              >
                Type
              </label>
              <select
                id="activity-type"
                className="glass-input full-width-input"
                style={{ width: '100%', padding: '12px', appearance: 'auto' }}
              >
                <option value="activity">Sightseeing</option>
                <option value="food">Food & Dining</option>
                <option value="transport">Transport</option>
                <option value="shopping">Shopping</option>
                <option value="hotel">Accommodation</option>
                <option value="flight">Flight</option>
              </select>
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Cover Image
            </label>
            {newActivityImage ? (
              <div style={{ position: 'relative', width: '100%', height: '140px', borderRadius: '8px', overflow: 'hidden', backgroundImage: `url(${newActivityImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <button
                  style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' }}
                  onClick={() => setNewActivityImage(null)}
                >
                  Remove
                </button>
              </div>
            ) : (
              <div
                style={{ border: '2px dashed var(--border-subtle)', borderRadius: '8px', padding: '24px', textAlign: 'center', cursor: 'pointer' }}
                onClick={() => setNewActivityImage('https://images.unsplash.com/photo-1537531383496-47a782e39c1e?w=800&auto=format&fit=crop')}
              >
                <Camera size={24} style={{ margin: '0 auto 8px', color: 'var(--text-secondary)', display: 'block' }} />
                <div style={{ fontSize: '0.9rem' }}>Click to browse photos</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Simulated upload</div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <button
            onClick={onClose}
            style={{ padding: '10px 20px', borderRadius: '8px', background: 'var(--bg-surface-hover)', color: 'var(--text-secondary)', border: 'none', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            style={{ padding: '10px 20px', borderRadius: '8px', background: 'var(--accent-primary)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}
          >
            Add Activity
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
