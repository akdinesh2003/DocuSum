'use server';

// Mock implementation of sentiment analyzer as the original was not provided.
export async function analyzeSentiment(text: string): Promise<{ sentiment: string; tone: string; }> {
    // In a real application, this would use a sentiment analysis service or library.
    // This mock demonstrates the expected output format for the deep summary flow.
    // We are not using Math.random() to avoid hydration errors in case this file is ever used on the client.
    // Instead we will use a deterministic approach based on text length.

    const sentiments = ['positive', 'negative', 'neutral'];
    const tones = ['formal', 'informal', 'optimistic', 'pessimistic', 'joyful', 'sad'];

    const sentimentIndex = text.length % sentiments.length;
    const toneIndex = (text.length + 1) % tones.length;

    const sentiment = sentiments[sentimentIndex];
    const tone = tones[toneIndex];

    return { sentiment, tone };
}
