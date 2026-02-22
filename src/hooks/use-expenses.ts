
"use client"

import { useState, useEffect, useMemo } from 'react';

export type Category = 'Food' | 'Transport' | 'Shopping' | 'Bills' | 'Other';

export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: Category;
  description: string;
  date: string;
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Local storage persistence
  useEffect(() => {
    const saved = localStorage.getItem('as_expenses');
    if (saved) {
      try {
        setExpenses(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse local expenses data', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('as_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (expense: Omit<Expense, 'id' | 'date'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
    };
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const totalSpent = useMemo(() => {
    const today = new Date().toLocaleDateString();
    return expenses
      .filter((e) => new Date(e.date).toLocaleDateString() === today)
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [expenses]);

  const categorySummary = useMemo(() => {
    const today = new Date().toLocaleDateString();
    const summaries: Record<Category, number> = {
      Food: 0,
      Transport: 0,
      Shopping: 0,
      Bills: 0,
      Other: 0,
    };

    expenses
      .filter((e) => new Date(e.date).toLocaleDateString() === today)
      .forEach((e) => {
        summaries[e.category] += e.amount;
      });

    return summaries;
  }, [expenses]);

  return {
    expenses,
    addExpense,
    deleteExpense,
    totalSpent,
    categorySummary,
  };
}
