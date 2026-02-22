
"use client"

import Image from 'next/image';
import { useExpenses } from '@/hooks/use-expenses';
import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Toaster } from '@/components/ui/toaster';
import { Separator } from '@/components/ui/separator';
import { History, TrendingUp, Wallet } from 'lucide-react';

export default function Home() {
  const { totalSpent, categorySummary, addExpense, expenses } = useExpenses();
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-finance');

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black pb-20">
      <Toaster />

      {/* Hero Section */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <Image
          src={heroImage?.imageUrl || 'https://picsum.photos/seed/as-expenses/1200/600'}
          alt="Finance tracker hero"
          fill
          className="object-cover opacity-50"
          priority
          data-ai-hint="finance wealth"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-7xl mx-auto">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tighter text-white">
              AS <span className="text-primary">—</span> <span className="text-white/90">Daily Expenses</span>
            </h1>
            <p className="text-zinc-400 text-lg md:text-xl max-w-2xl font-body">
              Premium expense management for the modern individual. Track your spending with precision and style.
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 md:px-12 -mt-12 relative z-10 space-y-12">
        {/* Total Display */}
        <section className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-8 rounded-3xl yellow-glow flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-zinc-400 font-medium">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span>TODAY'S TOTAL SPENDING</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-primary text-2xl font-bold">Rs.</span>
              <h2 className="text-5xl md:text-7xl font-black font-headline tabular-nums">
                {totalSpent.toLocaleString()}
              </h2>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="p-4 bg-zinc-800/50 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                <Wallet className="text-primary w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Transactions</p>
                <p className="text-xl font-bold font-headline">{expenses.length}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Summary */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <SummaryCard category="Food" amount={categorySummary.Food} />
          <SummaryCard category="Transport" amount={categorySummary.Transport} />
          <SummaryCard category="Shopping" amount={categorySummary.Shopping} />
          <SummaryCard category="Bills" amount={categorySummary.Bills} />
          <SummaryCard category="Other" amount={categorySummary.Other} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Form */}
          <section className="lg:col-span-5">
            <ExpenseForm onAdd={addExpense} />
          </section>

          {/* Right Column: History */}
          <section className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold font-headline flex items-center gap-3">
                <History className="w-6 h-6 text-primary" />
                Recent History
              </h2>
            </div>
            <div className="space-y-4">
              {expenses.length === 0 ? (
                <div className="p-12 text-center border border-dashed border-zinc-800 rounded-2xl text-zinc-500">
                  <p className="text-lg">No expenses recorded yet.</p>
                  <p className="text-sm">Add your first expense to get started.</p>
                </div>
              ) : (
                expenses.slice(0, 10).map((expense) => (
                  <div key={expense.id} className="group p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-between hover:border-zinc-700 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-primary transition-colors">
                        <span className="text-xs font-bold">{expense.category[0]}</span>
                      </div>
                      <div>
                        <h4 className="font-bold">{expense.name}</h4>
                        <p className="text-sm text-zinc-500 line-clamp-1">{expense.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg font-headline">
                        <span className="text-primary text-sm mr-1">Rs.</span>
                        {expense.amount.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-tighter">
                        {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="mt-20 py-12 px-12 border-t border-zinc-900 text-center">
        <p className="text-4xl font-black font-headline tracking-tighter text-zinc-800 opacity-50">
          AS EXPENSES
        </p>
        <p className="text-xs text-zinc-600 mt-2 font-bold tracking-widest uppercase">
          Elevating Your Financial Perspective
        </p>
      </footer>
    </div>
  );
}
