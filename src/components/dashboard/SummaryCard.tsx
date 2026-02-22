
"use client"

import { LucideIcon, Utensils, Car, ShoppingBag, Receipt, LayoutGrid } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Category } from '@/hooks/use-expenses';

const iconMap: Record<Category, LucideIcon> = {
  Food: Utensils,
  Transport: Car,
  Shopping: ShoppingBag,
  Bills: Receipt,
  Other: LayoutGrid,
};

interface SummaryCardProps {
  category: Category;
  amount: number;
}

export function SummaryCard({ category, amount }: SummaryCardProps) {
  const Icon = iconMap[category];

  return (
    <Card className="p-4 bg-zinc-900 border-zinc-800 transition-all hover:scale-105 hover:border-primary/50 group cursor-default">
      <div className="flex flex-col gap-4">
        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors duration-300">
          <Icon className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider">{category}</h3>
          <p className="text-xl font-bold font-headline">
            <span className="text-primary mr-1">Rs.</span>
            {amount.toLocaleString()}
          </p>
        </div>
      </div>
    </Card>
  );
}
