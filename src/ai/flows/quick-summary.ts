 'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a quick, bullet-point summary of a document.
 *
 * - quickSummary - A function that takes document content as input and returns a bullet-point summary.
 * - QuickSummaryInput - The input type for the quickSummary function.
 * - QuickSummaryOutput - The return type for the quickSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuickSummaryInputSchema = z.object({
  documentContent: z
    .string()
    .describe('The content of the document to be summarized.'),
});
export type QuickSummaryInput = z.infer<typeof QuickSummaryInputSchema>;

const QuickSummaryOutputSchema = z.object({
  summary: z
    .string()
    .describe('A bullet-point summary of the key ideas in the document.'),
});
export type QuickSummaryOutput = z.infer<typeof QuickSummaryOutputSchema>;

export async function quickSummary(input: QuickSummaryInput): Promise<QuickSummaryOutput> {
  return quickSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'quickSummaryPrompt',
  input: {schema: QuickSummaryInputSchema},
  output: {schema: QuickSummaryOutputSchema},
  prompt: `You are an expert summarizer. Please provide a concise, bullet-point summary of the following document. Focus on the key ideas and main points.

Document:
{{{documentContent}}}`,
});

const quickSummaryFlow = ai.defineFlow(
  {
    name: 'quickSummaryFlow',
    inputSchema: QuickSummaryInputSchema,
    outputSchema: QuickSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
