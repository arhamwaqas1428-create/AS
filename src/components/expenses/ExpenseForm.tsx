
"use client"

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Category } from '@/hooks/use-expenses';
import { Sparkles, Plus, CalendarIcon } from 'lucide-react';
import { suggestExpenseCategory } from '@/ai/flows/suggest-expense-category-flow';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ExpenseFormProps {
  onAdd: (expense: { name: string; amount: number; category: Category; description: string; date: string }) => void;
}

export function ExpenseForm({ onAdd }: ExpenseFormProps) {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Other');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [isSuggesting, setIsSuggesting] = useState(false);

  const handleSuggestCategory = async () => {
    if (!description && !name) {
      toast({
        title: "Information missing",
        description: "Please provide a name or description for category suggestion.",
        variant: "destructive"
      });
      return;
    }

    setIsSuggesting(true);
    try {
      const result = await suggestExpenseCategory({ description: description || name });
      setCategory(result.category as Category);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) {
      toast({
        title: "Validation error",
        description: "Expense name and amount are required.",
        variant: "destructive"
      });
      return;
    }

    onAdd({
      name,
      amount: parseFloat(amount),
      category,
      description,
      date: date.toISOString(),
    });

    setName('');
    setAmount('');
    setCategory('Other');
    setDescription('');
    setDate(new Date());
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800 yellow-glow">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          New Expense
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="expense-name" className="text-zinc-400">Expense Name</Label>
              <Input
                id="expense-name"
                placeholder="Rent, Lunch, etc."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-black border-zinc-800 focus-visible:ring-primary h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expense-amount" className="text-zinc-400">Amount (PKR)</Label>
              <Input
                id="expense-amount"
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-black border-zinc-800 focus-visible:ring-primary h-12"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="expense-category" className="text-zinc-400">Category</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleSuggestCategory}
                  disabled={isSuggesting}
                  className="text-[10px] h-6 px-2 text-primary hover:text-primary/80 hover:bg-primary/10 gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  {isSuggesting ? '...' : 'Auto'}
                </Button>
              </div>
              <Select value={category} onValueChange={(val) => setCategory(val as Category)}>
                <SelectTrigger className="bg-black border-zinc-800 focus:ring-primary h-12">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Transport">Transport</SelectItem>
                  <SelectItem value="Shopping">Shopping</SelectItem>
                  <SelectItem value="Bills">Bills</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-400">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full h-12 bg-black border-zinc-800 justify-start text-left font-normal hover:bg-zinc-900",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-800" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expense-desc" className="text-zinc-400">Description / Notes</Label>
            <Textarea
              id="expense-desc"
              placeholder="What was this for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-black border-zinc-800 focus-visible:ring-primary min-h-[80px]"
            />
          </div>

          <Button type="submit" className="w-full h-14 bg-primary text-black hover:bg-primary/90 font-bold text-lg rounded-xl shadow-lg shadow-primary/10 transition-all hover:scale-[1.02] active:scale-[0.98]">
            <Plus className="mr-2 w-5 h-5" /> Add Expense
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
