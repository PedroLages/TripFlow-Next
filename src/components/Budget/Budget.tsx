"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Budget.css';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { PieChart, DollarSign, TrendingUp, Plus, Plane, Hotel, Utensils, ShoppingBag, ArrowUpRight, ArrowDownRight, CreditCard, Wallet, Lock, EyeOff, Eye } from 'lucide-react';

const expenses = [
  { id: 1, title: 'ANA Flights to NRT', category: 'transport', amount: 1250.00, currency: 'USD', date: '2026-02-15', paidBy: 'Alex' },
  { id: 2, title: 'Shinjuku Prince Hotel (5 nights)', category: 'lodging', amount: 840.00, currency: 'USD', date: '2026-02-16', paidBy: 'You' },
  { id: 3, title: 'JR Pass (7 Days)', category: 'transport', amount: 320.00, currency: 'USD', date: '2026-02-18', paidBy: 'Sarah' },
  { id: 4, title: 'TeamLab Planets Tickets', category: 'activities', amount: 45.00, currency: 'USD', date: '2026-02-20', paidBy: 'You' },
  { id: 5, title: 'Pre-loaded Suica Card', category: 'transport', amount: 100.00, currency: 'USD', date: '2026-02-21', paidBy: 'You' },
  { id: 6, title: 'Ichiran Ramen Dinner', category: 'food', amount: 42.00, currency: 'USD', date: '2026-02-22', paidBy: 'Alex' },
];

export const Budget: React.FC = () => {
  const [currency, setCurrency] = useState('USD');
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  // Blind Budgeting state
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isBlindMode, setIsBlindMode] = useState(true);

  const totalBudget = 5000;
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const percentSpent = (totalSpent / totalBudget) * 100;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'transport': return <Plane size={18} />;
      case 'lodging': return <Hotel size={18} />;
      case 'food': return <Utensils size={18} />;
      case 'shopping': return <ShoppingBag size={18} />;
      default: return <DollarSign size={18} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'transport': return 'var(--accent-glow)';
      case 'lodging': return '#10b981'; // green
      case 'food': return '#f59e0b'; // orange
      case 'activities': return '#8b5cf6'; // purple
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <motion.div
      className="budget-container"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
    >
      <div className="budget-header">
        <div>
          <h2>Trip Budget Tracker</h2>
          <p className="text-secondary">Monitor your spending across multiple currencies</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select className="currency-selector" value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="JPY">JPY (¥)</option>
            <option value="GBP">GBP (£)</option>
          </select>
          <Button variant="ghost" onClick={() => setIsSetupOpen(true)}>
            {isBlindMode ? <EyeOff size={16} /> : <Eye size={16} />}
            {isBlindMode ? 'Blind Mode On' : 'Budget Revealed'}
          </Button>
          <Button icon={<Plus size={16} />} onClick={() => setIsAddExpenseOpen(true)}>Add Expense</Button>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="budget-metrics-grid">
        <Card className="metric-card emphasis">
          <CardContent style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="metric-header">
              <span className="metric-label">{isBlindMode ? 'Target Budget' : 'Remaining Budget'}</span>
              <div className="metric-icon">{isBlindMode ? <Lock size={16} /> : <Wallet size={16} />}</div>
            </div>

            {isBlindMode ? (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                 <div className="metric-value" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                   <span style={{ fontSize: '1.5rem' }}>••••••</span>
                 </div>
                 <div className="metric-trend" style={{ color: 'var(--text-tertiary)', background: 'var(--bg-hover)' }}>
                   Hidden by Host until Feb 28
                 </div>
               </div>
            ) : (
              <>
                <div className="metric-value highlight">${(totalBudget - totalSpent).toLocaleString()}</div>
                <div className="metric-trend positive">
                  <ArrowDownRight size={14} /> 12% under projected pace
                </div>
              </>
            )}

          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="metric-header">
              <span className="metric-label">Total Spent</span>
              <div className="metric-icon"><CreditCard size={16} /></div>
            </div>
            <div className="metric-value">${totalSpent.toLocaleString()}</div>

            {!isBlindMode && (
              <>
                <div className="progress-bar-container small" style={{ marginTop: '8px' }}>
                  <div className="progress-bar-fill gradient" style={{ width: `${percentSpent}%` }}></div>
                </div>
                <div className="metric-subtext">{percentSpent.toFixed(1)}% of ${totalBudget.toLocaleString()} total</div>
              </>
            )}
            {isBlindMode && (
              <div className="metric-subtext" style={{ marginTop: 'auto' }}>All tracked expenses to date</div>
            )}
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="metric-header">
              <span className="metric-label">Daily Average</span>
              <div className="metric-icon"><TrendingUp size={16} /></div>
            </div>
            <div className="metric-value">$185.50</div>
            <div className="metric-trend negative">
              <ArrowUpRight size={14} /> +$15.00 from yesterday
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="budget-dashboard-grid advanced">
        {/* Categories Breakdown (Redesigned) */}
        <Card className="categories-breakdown-card">
          <CardHeader>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PieChart size={18} className="text-secondary" />
                <CardTitle>Spending by Category</CardTitle>
              </div>
              <Button variant="ghost" size="sm">Details</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="category-bars advanced">
              <div className="cat-bar">
                <div className="cat-bar-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="color-dot" style={{ background: 'var(--accent-primary)' }}></div>
                    <span>Transport</span>
                  </div>
                  <div className="cat-bar-values">
                    <span className="amount">$1,670.00</span>
                    <span className="percentage text-secondary">64%</span>
                  </div>
                </div>
                <div className="progress-bar-container small">
                  <div className="progress-bar-fill" style={{ width: '64%', backgroundColor: 'var(--accent-primary)' }}></div>
                </div>
              </div>

              <div className="cat-bar">
                <div className="cat-bar-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="color-dot" style={{ background: '#10b981' }}></div>
                    <span>Lodging</span>
                  </div>
                  <div className="cat-bar-values">
                    <span className="amount">$840.00</span>
                    <span className="percentage text-secondary">32%</span>
                  </div>
                </div>
                <div className="progress-bar-container small">
                  <div className="progress-bar-fill" style={{ width: '32%', backgroundColor: '#10b981' }}></div>
                </div>
              </div>

              <div className="cat-bar">
                <div className="cat-bar-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="color-dot" style={{ background: '#f59e0b' }}></div>
                    <span>Food & Dining</span>
                  </div>
                  <div className="cat-bar-values">
                    <span className="amount">$42.00</span>
                    <span className="percentage text-secondary">2%</span>
                  </div>
                </div>
                <div className="progress-bar-container small">
                  <div className="progress-bar-fill" style={{ width: '2%', backgroundColor: '#f59e0b' }}></div>
                </div>
              </div>

              <div className="cat-bar">
                <div className="cat-bar-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="color-dot" style={{ background: '#8b5cf6' }}></div>
                    <span>Activities</span>
                  </div>
                  <div className="cat-bar-values">
                    <span className="amount">$45.00</span>
                    <span className="percentage text-secondary">2%</span>
                  </div>
                </div>
                <div className="progress-bar-container small">
                  <div className="progress-bar-fill" style={{ width: '2%', backgroundColor: '#8b5cf6' }}></div>
                </div>
              </div>
            </div>

            <div className="ai-insight-box mt-6">
              <TrendingUp size={20} className="insight-icon" />
              <div>
                <h4 className="insight-title">AI Insight</h4>
                <p className="insight-text">You are spending 15% less on lodging compared to similar Tokyo trips. Great job finding deals!</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expenses List */}
        <Card className="expenses-list-card">
          <CardHeader className="expenses-card-header">
            <CardTitle>Recent Transactions</CardTitle>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="ghost" size="sm">Filter</Button>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="expenses-list advanced">
              {expenses.map((expense) => (
                <div key={expense.id} className="expense-row" style={{ cursor: 'pointer' }}>
                  <div
                    className="expense-icon-wrapper"
                    style={{ backgroundColor: `${getCategoryColor(expense.category)}20`, color: getCategoryColor(expense.category) }}
                  >
                    {getCategoryIcon(expense.category)}
                  </div>
                  <div className="expense-details">
                    <div className="expense-title">{expense.title}</div>
                    <div className="expense-meta text-secondary">
                      <span>{expense.date}</span>
                      <span className="bullet-separator">•</span>
                      <span>Paid by {expense.paidBy}</span>
                    </div>
                  </div>
                  <div className="expense-amount" style={{ fontWeight: 600 }}>
                    ${expense.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Blind Budget Setup Modal */}
      <AnimatePresence>
        {isSetupOpen && (
          <motion.div
            className="wizard-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => setIsSetupOpen(false)}
          >
            <motion.div
              className="wizard-container glass-panel"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{ padding: '32px', borderRadius: '16px', width: '100%', maxWidth: '500px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <EyeOff size={24} color="var(--accent-primary)" />
                <h2 style={{ margin: 0 }}>Blind Budget Setting</h2>
              </div>

              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5 }}>
                Set a secret target budget for the trip. Group members will track their expenses normally, but the total goal will remain hidden until you reveal it, preventing the "spend up to the limit" psychological effect.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Target Budget ({currency})</label>
                  <input type="number" className="glass-input full-width-input" defaultValue={5000} style={{ width: '100%', padding: '12px', border: '1px solid var(--border-subtle)', borderRadius: '8px', background: 'var(--bg-surface)', fontSize: '1.2rem', fontWeight: 600 }} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'rgba(var(--accent-primary-rgb), 0.1)', borderRadius: '8px', border: '1px solid rgba(var(--accent-primary-rgb), 0.2)' }}>
                  <input
                    type="checkbox"
                    id="blindToggle"
                    checked={isBlindMode}
                    onChange={(e) => setIsBlindMode(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)' }}
                  />
                  <label htmlFor="blindToggle" style={{ fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer' }}>Keep target budget hidden from members</label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <Button variant="ghost" onClick={() => setIsSetupOpen(false)}>Cancel</Button>
                <Button onClick={() => setIsSetupOpen(false)}>Save Settings</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Expense Modal */}
      <AnimatePresence>
        {isAddExpenseOpen && (
          <motion.div
            className="wizard-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => setIsAddExpenseOpen(false)}
          >
            <motion.div
              className="wizard-container"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{ background: 'var(--bg-base)', padding: '32px', borderRadius: '16px', width: '100%', maxWidth: '500px', boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }}
            >
              <h2 style={{marginTop: 0, marginBottom: '24px'}}>Add Expense</h2>
              <div style={{display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)'}}>Description</label>
                  <input type="text" className="glass-input full-width-input" placeholder="What did you pay for?" style={{width: '100%', padding: '12px', border: '1px solid var(--border-subtle)', borderRadius: '8px', background: 'var(--bg-surface)'}} />
                </div>
                <div style={{display: 'flex', gap: '16px'}}>
                  <div style={{flex: 1}}>
                    <label style={{display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)'}}>Amount ({currency})</label>
                    <input type="number" className="glass-input full-width-input" placeholder="0.00" style={{width: '100%', padding: '12px', border: '1px solid var(--border-subtle)', borderRadius: '8px', background: 'var(--bg-surface)'}} />
                  </div>
                  <div style={{flex: 1}}>
                    <label style={{display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)'}}>Category</label>
                    <select className="glass-input full-width-input" style={{width: '100%', padding: '12px', appearance: 'auto', border: '1px solid var(--border-subtle)', borderRadius: '8px', background: 'var(--bg-surface)'}}>
                      <option>Food & Dining</option>
                      <option>Transport</option>
                      <option>Lodging</option>
                      <option>Activities</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)'}}>Paid By</label>
                  <select className="glass-input full-width-input" style={{width: '100%', padding: '12px', appearance: 'auto', border: '1px solid var(--border-subtle)', borderRadius: '8px', background: 'var(--bg-surface)'}}>
                    <option>You (Split Equally)</option>
                    <option>Alex (Split Equally)</option>
                    <option>Sarah (Split Equally)</option>
                    <option>Just Me (Personal)</option>
                  </select>
                </div>
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '12px'}}>
                <Button variant="ghost" onClick={() => setIsAddExpenseOpen(false)}>Cancel</Button>
                <Button onClick={() => setIsAddExpenseOpen(false)}>Save Expense</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};
