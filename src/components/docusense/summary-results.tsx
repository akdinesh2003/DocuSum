"use client";

import type { FormState } from "@/app/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, FileText, CheckCircle, ThumbsUp, Bot } from "lucide-react";
import { SentimentMeter } from "./sentiment-meter";
import { ExportButton } from "./export-button";

interface SummaryResultsProps {
  state: FormState;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 pt-8">
      <div className="flex flex-col items-center text-center text-muted-foreground">
        <Bot className="h-12 w-12 mb-4 animate-pulse" />
        <p className="text-lg font-medium">AI is analyzing your document...</p>
        <p className="text-sm">This may take a few moments.</p>
      </div>
      <Card className="bg-secondary/50">
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </CardContent>
      </Card>
    </div>
  );
}

export function SummaryResults({ state }: SummaryResultsProps) {
  const { status, result } = state;

  if (status === "idle") {
    return null;
  }

  if (status === "error") {
      return (
        <div className="flex items-center justify-center rounded-lg bg-destructive/10 p-8 text-center mt-8 border border-destructive/50">
          <div className="flex flex-col items-center gap-2 text-destructive">
              <AlertCircle className="h-12 w-12" />
              <p className="font-semibold text-xl">Analysis Failed</p>
              <p className="text-sm">{state.message}</p>
          </div>
        </div>
      );
  }

  if (status !== 'success' || !result) {
    return <LoadingSkeleton />;
  }

  const qualityPercentage = Math.round(result.qualityScore * 100);

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500 pt-8">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-3xl font-bold font-headline flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-500" />
            Analysis Complete
        </h2>
        <ExportButton result={result} />
      </div>
      
      <Card className="bg-secondary/50 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <FileText className="h-6 w-6 text-primary" />
            Generated Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-base dark:prose-invert max-w-none whitespace-pre-wrap font-body leading-relaxed">
            {result.summary}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="bg-secondary/50 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <ThumbsUp className="h-5 w-5 text-primary" />
              Quality Score
            </CardTitle>
            <CardDescription>
              AI-powered evaluation of the summary's clarity and relevance.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-center mb-2">
                <span className="text-4xl font-bold text-primary">{qualityPercentage}%</span>
              </div>
              <Progress value={qualityPercentage} aria-label={`${qualityPercentage}% quality score`} />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Justification</h4>
              <p className="text-sm text-muted-foreground italic mt-1">"{result.justification}"</p>
            </div>
          </CardContent>
        </Card>

        {result.sentiment && <SentimentMeter sentiment={result.sentiment} tone={result.tone} />}
      </div>
    </div>
  );
}
