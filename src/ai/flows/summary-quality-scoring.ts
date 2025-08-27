/**
 * @fileOverview Provides a flow for scoring summary quality based on length, clarity, and tone.
 *
 * - summaryQualityScoring - A function that calculates a quality score for a given summary.
 * - SummaryQualityScoringInput - The input type for the summaryQualityScoring function.
 * - SummaryQualityScoringOutput - The return type for the summaryQualityScoring function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummaryQualityScoringInputSchema = z.object({
  summary: z.string().describe('The summary to be evaluated.'),
  originalDocument: z.string().describe('The original document that was summarized.'),
});
export type SummaryQualityScoringInput = z.infer<typeof SummaryQualityScoringInputSchema>;

const SummaryQualityScoringOutputSchema = z.object({
  qualityScore: z
    .number()
    .describe(
      'A score between 0 and 1 (inclusive) representing the quality of the summary. Higher scores indicate better quality.'
    ),
  justification: z
    .string()
    .describe('A detailed explanation of why the summary received the given quality score.'),
});
export type SummaryQualityScoringOutput = z.infer<typeof SummaryQualityScoringOutputSchema>;

export async function summaryQualityScoring(input: SummaryQualityScoringInput): Promise<SummaryQualityScoringOutput> {
  return summaryQualityScoringFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summaryQualityScoringPrompt',
  input: {schema: SummaryQualityScoringInputSchema},
  output: {schema: SummaryQualityScoringOutputSchema},
  prompt: `You are an expert in evaluating the quality of summaries.  You will receive a summary and the original document.

You will evaluate the summary based on the following criteria:
* Length: Is the summary an appropriate length given the length of the original document?
* Clarity: Is the summary easy to understand?
* Tone: Does the summary accurately reflect the tone of the original document?

Based on these criteria, you will assign a quality score between 0 and 1 (inclusive), with 1 being the highest possible score. You will also provide a detailed justification for the score.

Original Document: {{{originalDocument}}}

Summary: {{{summary}}}

Quality Score:`,
});

const summaryQualityScoringFlow = ai.defineFlow(
  {
    name: 'summaryQualityScoringFlow',
    inputSchema: SummaryQualityScoringInputSchema,
    outputSchema: SummaryQualityScoringOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
