"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Budget.css';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/ButtonLegacy';
import { PieChart, DollarSign, TrendingUp, Plus, Plane, Hotel, Utensils, ShoppingBag, ArrowUpRight, CreditCard, HelpCircle } from 'lucide-react';
import { useBlindBudget } from '@/hooks/use-blind-budget';
import { useMockAuth } from '@/lib/mock-auth';
import { BlindBudgetForm } from '../BlindBudget/BlindBudgetForm';
import { GroupLimitDisplay } from '../BlindBudget/GroupLimitDisplay';
import { BudgetExplainerCarousel } from '../BlindBudget/BudgetExplainerCarousel';
import { MockUserSwitcher } from '../BlindBudget/MockUserSwitcher';
import { centsToDollars } from '@/lib/blind-budget';

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
  const [isExplainerOpen, setIsExplainerOpen] = useState(false);

  const { user } = useMockAuth();
  const {
    myBudget,
    myBudgetLoading,
    groupLimitCents,
    budgetCount,
    memberCount,
    allBudgetsReady,
    isSettingGroupMin,
    setBudget,
    setBudgetPending,
  } = useBlindBudget();

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalBudget = groupLimitCents !== null ? centsToDollars(groupLimitCents) : null;
  const percentSpent = totalBudget ? (totalSpent / totalBudget) * 100 : 0;

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
          <p className="text-secondary">Blind budgeting — your amount stays private</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <MockUserSwitcher />
          <select className="currency-selector" value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="JPY">JPY (¥)</option>
            <option value="GBP">GBP (£)</option>
          </select>
          <Button variant="ghost" onClick={() => setIsExplainerOpen(true)}>
            <HelpCircle size={16} />
            How it works
          </Button>
          <Button icon={<Plus size={16} />} onClick={() => setIsAddExpenseOpen(true)}>Add Expense</Button>
        </div>
      </div>

      {/* Blind Budgeting Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <Card className="metric-card">
          <CardContent style={{ padding: '24px' }}>
            <BlindBudgetForm
              currentAmountCents={myBudget?.amount_cents ?? null}
              currencyCode={currency}
              isPending={setBudgetPending}
              isSettingGroupMin={isSettingGroupMin}
              onSubmit={setBudget}
            />
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent style={{ padding: '24px' }}>
            <GroupLimitDisplay
              groupLimitCents={groupLimitCents}
              budgetCount={budgetCount}
              memberCount={memberCount}
              currencyCode={currency}
              allReady={allBudgetsReady}
            />
          </CardContent>
        </Card>
      </div>

      {/* Spending Summary */}
      <div className="budget-metrics-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <Card className="metric-card">
          <CardContent style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="metric-header">
              <span className="metric-label">Total Spent</span>
              <div className="metric-icon"><CreditCard size={16} /></div>
            </div>
            <div className="metric-value">${totalSpent.toLocaleString()}</div>
            {totalBudget && (
              <>
                <div className="progress-bar-container small" style={{ marginTop: '8px' }}>
                  <div className="progress-bar-fill gradient" style={{ width: `${Math.min(percentSpent, 100)}%` }}></div>
                </div>
                <div className="metric-subtext">{percentSpent.toFixed(1)}% of group limit</div>
              </>
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

      <BudgetExplainerCarousel
        open={isExplainerOpen}
        onClose={() => setIsExplainerOpen(false)}
        onComplete={() => setIsExplainerOpen(false)}
      />

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
