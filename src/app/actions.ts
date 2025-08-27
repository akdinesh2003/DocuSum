"use server";

import { z } from "zod";
import { quickSummary, type QuickSummaryOutput } from "@/ai/flows/quick-summary";
import { deepSummary, type DeepSummaryOutput } from "@/ai/flows/deep-summary";
import { summaryQualityScoring, type SummaryQualityScoringOutput } from "@/ai/flows/summary-quality-scoring";

const FormSchema = z.object({
  documentContent: z.string().min(50, {
    message: "Document content must be at least 50 characters.",
  }),
  summaryType: z.enum(["quick", "deep"]),
});

export type SummaryResult = (QuickSummaryOutput | (Omit<DeepSummaryOutput, 'sentiment' | 'tone'> & { sentiment: string | null, tone: string | null })) & SummaryQualityScoringOutput;

export interface FormState {
  status: "idle" | "success" | "error";
  message: string;
  result: SummaryResult | null;
}

export async function generateSummaryAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const validatedFields = FormSchema.safeParse({
      documentContent: formData.get("documentContent"),
      summaryType: formData.get("summaryType"),
    });

    if (!validatedFields.success) {
      return {
        status: "error",
        message: validatedFields.error.errors.map((e) => e.message).join(", "),
        result: null,
      };
    }

    const { documentContent, summaryType } = validatedFields.data;
    
    let summaryResult: QuickSummaryOutput | DeepSummaryOutput;
    
    if (summaryType === "deep") {
      summaryResult = await deepSummary({ documentContent });
    } else {
      summaryResult = await quickSummary({ documentContent });
    }

    const qualityResult = await summaryQualityScoring({
      summary: summaryResult.summary,
      originalDocument: documentContent,
    });
    
    const combinedResult: SummaryResult = {
        ...summaryResult,
        // Ensure sentiment and tone are present, even if null for quick summary
        sentiment: 'sentiment' in summaryResult ? summaryResult.sentiment : null,
        tone: 'tone' in summaryResult ? summaryResult.tone : null,
        ...qualityResult
    };

    return {
      status: "success",
      message: "Summary generated successfully.",
      result: combinedResult,
    };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      status: "error",
      message: `Failed to generate summary: ${errorMessage}`,
      result: null,
    };
  }
}
