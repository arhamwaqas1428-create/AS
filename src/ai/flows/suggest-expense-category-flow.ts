'use server';
/**
 * @fileOverview A Genkit flow for suggesting an expense category based on a description.
 *
 * - suggestExpenseCategory - A function that suggests an expense category.
 * - SuggestExpenseCategoryInput - The input type for the suggestExpenseCategory function.
 * - SuggestExpenseCategoryOutput - The return type for the suggestExpenseCategory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExpenseCategories = z.enum(['Food', 'Transport', 'Shopping', 'Bills', 'Other']);

const SuggestExpenseCategoryInputSchema = z.object({
  description: z.string().describe('The description of the expense.'),
});
export type SuggestExpenseCategoryInput = z.infer<typeof SuggestExpenseCategoryInputSchema>;

const SuggestExpenseCategoryOutputSchema = z.object({
  category: ExpenseCategories.describe('The suggested category for the expense.'),
});
export type SuggestExpenseCategoryOutput = z.infer<typeof SuggestExpenseCategoryOutputSchema>;

export async function suggestExpenseCategory(input: SuggestExpenseCategoryInput): Promise<SuggestExpenseCategoryOutput> {
  return suggestExpenseCategoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestExpenseCategoryPrompt',
  input: {schema: SuggestExpenseCategoryInputSchema},
  output: {schema: SuggestExpenseCategoryOutputSchema},
  prompt: `You are an AI assistant that suggests the best category for an expense based on its description.

The available categories are: {{#each ${ExpenseCategories.options}}}- {{{this}}}
{{/each}}

Suggest only one category that best fits the following expense description:
Description: {{{description}}}`,
});

const suggestExpenseCategoryFlow = ai.defineFlow(
  {
    name: 'suggestExpenseCategoryFlow',
    inputSchema: SuggestExpenseCategoryInputSchema,
    outputSchema: SuggestExpenseCategoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
