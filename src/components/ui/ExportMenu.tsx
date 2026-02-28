"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, FileText, Download, Calendar as CalendarIcon, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ExportMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <Button variant="secondary" onClick={() => setIsOpen(!isOpen)}>
        <Share2 size={16} />
        Share & Export
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: '240px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
              zIndex: 100,
              overflow: 'hidden'
            }}
          >
            <div style={{ padding: '8px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '8px 12px' }}>
                Export As
              </div>

              <button className="export-menu-item" onClick={() => setIsOpen(false)} style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '12px', padding: '10px 12px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', color: 'var(--text-primary)', borderRadius: '6px', transition: 'background 0.2s ease' }} onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-hover)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                <FileText size={16} className="text-blue" />
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>PDF Itinerary</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Printable document</div>
                </div>
              </button>

              <button className="export-menu-item" onClick={() => setIsOpen(false)} style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '12px', padding: '10px 12px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', color: 'var(--text-primary)', borderRadius: '6px', transition: 'background 0.2s ease' }} onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-hover)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                <Download size={16} className="text-green" />
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>CSV Spreadsheet</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Budget & Expenses data</div>
                </div>
              </button>

              <button className="export-menu-item" onClick={() => setIsOpen(false)} style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '12px', padding: '10px 12px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', color: 'var(--text-primary)', borderRadius: '6px', transition: 'background 0.2s ease' }} onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-hover)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                <CalendarIcon size={16} className="text-purple" />
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>iCal Sync</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Add to Apple/Google Cal</div>
                </div>
              </button>

              <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '8px 0' }}></div>

              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '8px 12px' }}>
                Share Link
              </div>

              <button className="export-menu-item" onClick={() => setIsOpen(false)} style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '12px', padding: '10px 12px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', color: 'var(--text-primary)', borderRadius: '6px', transition: 'background 0.2s ease' }} onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-hover)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                <Link2 size={16} className="text-secondary" />
                <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>Copy Invite Link</div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
