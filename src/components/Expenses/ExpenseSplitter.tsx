"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ExpenseSplitter.css';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Receipt, ArrowRight, Plus, CheckCircle2, ChevronDown, SplitSquareVertical } from 'lucide-react';

// Mock Data
const groupMembers = [
  { id: '1', name: 'You', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'Sarah', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'Alex', avatar: 'https://i.pravatar.cc/150?u=3' },
];

const mockExpenses = [
  { id: 1, desc: 'Airbnb Tokyo', amount: 1200, paidBy: '1', date: 'Oct 1', category: 'Lodging' },
  { id: 2, desc: 'Shinkansen Tickets', amount: 450, paidBy: '2', date: 'Oct 3', category: 'Transport' },
  { id: 3, desc: 'Izakaya Dinner', amount: 120, paidBy: '3', date: 'Oct 4', category: 'Food' },
];

const mockSettlements = [
  { from: '2', to: '1', amount: 250 },
  { from: '3', to: '1', amount: 280 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
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

export const ExpenseSplitter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'expenses' | 'balances'>('expenses');
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpenseDesc, setNewExpenseDesc] = useState('');

  const getUser = (id: string) => groupMembers.find(m => m.id === id);

  return (
    <motion.div
      className="expenses-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="expenses-header">
        <div>
          <h2>Group Expenses & Splits</h2>
          <p>Track team spending and settle up easily.</p>
        </div>
        <div className="header-actions">
          <Button onClick={() => setIsAddingExpense(true)}>
            <Plus size={16} style={{ marginRight: '8px' }}/> Add Expense
          </Button>
        </div>
      </div>

      <div className="expenses-tabs">
        <button
          className={`tab-btn ${activeTab === 'expenses' ? 'active' : ''}`}
          onClick={() => setActiveTab('expenses')}
        >
          <Receipt size={16} /> Recent Expenses
        </button>
        <button
          className={`tab-btn ${activeTab === 'balances' ? 'active' : ''}`}
          onClick={() => setActiveTab('balances')}
        >
          <SplitSquareVertical size={16} /> Balances & Settlements
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'expenses' && (
          <motion.div
            key="expenses"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -10 }}
            className="expenses-list-grid"
          >
            {isAddingExpense && (
              <motion.div variants={itemVariants} className="full-width">
                <Card className="add-expense-card glass-panel">
                  <CardHeader>
                    <CardTitle>New Expense</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="add-expense-form">
                      <div className="form-group">
                        <label>Description</label>
                        <input
                          type="text"
                          placeholder="What was this for?"
                          className="glass-input"
                          value={newExpenseDesc}
                          onChange={(e) => setNewExpenseDesc(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Amount ($)</label>
                        <input
                          type="number"
                          placeholder="0.00"
                          className="glass-input amount-input"
                          value={newExpenseAmount}
                          onChange={(e) => setNewExpenseAmount(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Paid By</label>
                        <button className="select-btn glass-input">
                          <img src={groupMembers[0].avatar} alt="" className="tiny-avatar"/> {groupMembers[0].name} <ChevronDown size={14}/>
                        </button>
                      </div>
                      <div className="form-actions">
                        <Button variant="ghost" onClick={() => setIsAddingExpense(false)}>Cancel</Button>
                        <Button onClick={() => {
                          setIsAddingExpense(false);
                          setNewExpenseAmount('');
                          setNewExpenseDesc('');
                        }}>Save Expense</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {mockExpenses.map((expense) => {
              const payer = getUser(expense.paidBy);
              return (
                <motion.div key={expense.id} variants={itemVariants}>
                  <Card className="expense-item-card glass-panel interactive-hover">
                    <div className="expense-item-left">
                      <div className="expense-icon-wrapper">
                        <Receipt size={20} />
                      </div>
                      <div className="expense-info">
                        <h4>{expense.desc}</h4>
                        <span className="expense-date">{expense.date} • {expense.category}</span>
                      </div>
                    </div>
                    <div className="expense-item-right">
                      <div className="payer-info">
                        <span>Paid by</span>
                        <img src={payer?.avatar} alt={payer?.name} title={payer?.name} className="payer-avatar" />
                      </div>
                      <div className="expense-amount highlight">${expense.amount.toFixed(2)}</div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {activeTab === 'balances' && (
          <motion.div
            key="balances"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -10 }}
            className="balances-grid"
          >
            <motion.div variants={itemVariants} className="full-width">
              <Card className="settlement-card glass-panel">
                <CardHeader>
                  <CardTitle>Suggested Settlements</CardTitle>
                  <p className="subtitle">The simplest way to settle all group debts.</p>
                </CardHeader>
                <CardContent>
                  <div className="settlements-list">
                    {mockSettlements.map((settlement, i) => {
                      const fromUser = getUser(settlement.from);
                      const toUser = getUser(settlement.to);
                      return (
                        <div key={i} className="settlement-row">
                          <div className="settlement-user">
                            <img src={fromUser?.avatar} alt={fromUser?.name} />
                            <span>{fromUser?.name}</span>
                          </div>
                          <div className="settlement-action">
                            <span>owes</span>
                            <div className="settlement-amount">${settlement.amount.toFixed(2)}</div>
                            <ArrowRight size={16} className="arrow-icon"/>
                          </div>
                          <div className="settlement-user">
                            <img src={toUser?.avatar} alt={toUser?.name} />
                            <span>{toUser?.name}</span>
                          </div>
                          <Button size="sm" variant="ghost" className="record-btn">
                            <CheckCircle2 size={14} style={{ marginRight: '6px' }}/> Record
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="full-width mt-6">
              <Card className="group-balances-card glass-panel">
                 <CardHeader>
                  <CardTitle>Individual Balances</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="balances-list">
                    {groupMembers.map(member => {
                      // Mock balance logic
                      const balance = member.id === '1' ? 530 : (member.id === '2' ? -250 : -280);
                      const isPositive = balance > 0;
                      return (
                        <div key={member.id} className="balance-row interactive-hover">
                          <div className="balance-user">
                            <img src={member.avatar} alt={member.name} />
                            <span>{member.name}</span>
                          </div>
                          <div className={`balance-amount ${isPositive ? 'positive' : 'negative'}`}>
                            {isPositive ? '+' : ''}{balance > 0 ? `$${balance.toFixed(2)}` : `-$${Math.abs(balance).toFixed(2)}`}
                            <span className="balance-label">{isPositive ? 'gets back' : 'owes'}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
