'use server';
/**
 * @fileOverview Provides a detailed, paragraph-style summary of a document with tone and sentiment analysis.
 *
 * - deepSummary - A function that accepts document content and returns a comprehensive summary with sentiment analysis.
 * - DeepSummaryInput - The input type for the deepSummary function, defining the document content.
 * - DeepSummaryOutput - The return type for the deepSummary function, providing the summary and sentiment analysis.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { analyzeSentiment } from '@/services/sentiment-analyzer';

const DeepSummaryInputSchema = z.object({
  documentContent: z
    .string()
    .describe('The content of the document to be summarized.'),
});
export type DeepSummaryInput = z.infer<typeof DeepSummaryInputSchema>;

const DeepSummaryOutputSchema = z.object({
  summary: z
    .string()
    .describe('A detailed, paragraph-style summary of the document.'),
  sentiment: z
    .string()
    .describe('The overall sentiment of the document (positive, negative, or neutral).'),
  tone: z.string().describe('The tone of the document (e.g., formal, informal, optimistic, pessimistic).'),
});
export type DeepSummaryOutput = z.infer<typeof DeepSummaryOutputSchema>;

export async function deepSummary(input: DeepSummaryInput): Promise<DeepSummaryOutput> {
  return deepSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'deepSummaryPrompt',
  input: {schema: DeepSummaryInputSchema},
  output: {schema: DeepSummaryOutputSchema},
  prompt: `You are an expert summarizer with a deep understanding of language and sentiment.

  Your task is to provide a detailed, paragraph-style summary of the following document content, along with an analysis of its overall sentiment and tone.

  Document Content: {{{documentContent}}}

  Summary Instructions:
  - The summary should be comprehensive and capture the main ideas of the document.
  - The sentiment analysis should accurately reflect the overall emotional tone of the document (positive, negative, or neutral).
  - The tone analysis should identify the specific tone used in the document (e.g., formal, informal, optimistic, pessimistic).

  Format your response as a JSON object with the following keys:
  - summary: The paragraph-style summary of the document.
  - sentiment: The overall sentiment of the document (positive, negative, or neutral).
  - tone: The tone of the document (e.g., formal, informal, optimistic, pessimistic).`,
});

const deepSummaryFlow = ai.defineFlow(
  {
    name: 'deepSummaryFlow',
    inputSchema: DeepSummaryInputSchema,
    outputSchema: DeepSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);

    // Sentiment analyzer
    const sentiment = await analyzeSentiment(input.documentContent);
    output!.sentiment = sentiment.sentiment;
    output!.tone = sentiment.tone;

    return output!;
  }
);
