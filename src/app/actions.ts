"use server";

import { z } from "zod";
import { quickSummary, type QuickSummaryOutput } from "@/ai/flows/quick-summary";
import { deepSummary, type DeepSummaryOutput } from "@/ai/flows/deep-summary";
import { summaryQualityScoring, type SummaryQualityScoringOutput } from "@/ai/flows/summary-quality-scoring";
import pdf from "pdf-parse";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const ACCEPTED_FILE_TYPES = ["text/plain", "application/pdf"];

const FormSchema = z.object({
  documentContent: z.string().optional(),
  documentFile: z
    .any()
    .refine((file) => !file || file.size === 0 || file.size <= MAX_FILE_SIZE, `Max file size is 4MB.`)
    .refine(
      (file) => !file || file.size === 0 || ACCEPTED_FILE_TYPES.includes(file.type),
      "Only .txt and .pdf files are accepted."
    ).optional(),
  summaryType: z.enum(["quick", "deep"]),
  inputType: z.enum(["text", "file"]),
}).refine(data => {
    if (data.inputType === 'text') {
        return data.documentContent && data.documentContent.length >= 50;
    }
    if (data.inputType === 'file') {
        return !!data.documentFile && data.documentFile.size > 0;
    }
    return false;
}, {
    message: "Please either paste text (min 50 chars) or upload a file.",
    path: ['documentContent'] // This error can be associated with a general field
});

export type SummaryResult = (QuickSummaryOutput | (Omit<DeepSummaryOutput, 'sentiment' | 'tone'> & { sentiment: string | null, tone: string | null })) & SummaryQualityScoringOutput;

export interface FormState {
  status: "idle" | "success" | "error";
  message: string;
  result: SummaryResult | null;
}

async function getDocumentContent(inputType: 'text' | 'file', text?: string, file?: File): Promise<string> {
    if (inputType === 'text') {
        return text || '';
    }

    if (!file || file.size === 0) {
        return '';
    }

    if (file.type === 'application/pdf') {
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const data = await pdf(fileBuffer);
        return data.text;
    } else {
        return await file.text();
    }
}

export async function generateSummaryAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const validatedFields = FormSchema.safeParse({
      documentContent: formData.get("documentContent"),
      documentFile: formData.get("documentFile"),
      summaryType: formData.get("summaryType"),
      inputType: formData.get("inputType"),
    });

    if (!validatedFields.success) {
      return {
        status: "error",
        message: validatedFields.error.errors.map((e) => e.message).join(", "),
        result: null,
      };
    }

    const { inputType, summaryType, documentContent: text, documentFile: file } = validatedFields.data;

    const documentContent = await getDocumentContent(inputType, text, file);

    if (!documentContent || documentContent.length < 50) {
        return {
            status: "error",
            message: "Extracted document content is less than 50 characters. Please provide more content.",
            result: null,
        }
    }
    
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
