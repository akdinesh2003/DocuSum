"use client";

import type { FormState } from "@/app/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, FileText, BarChart, ThumbsUp } from "lucide-react";
import { SentimentMeter } from "./sentiment-meter";
import { ExportButton } from "./export-button";

interface SummaryResultsProps {
  state: FormState;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
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
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

export function SummaryResults({ state }: SummaryResultsProps) {
  const { status, result } = state;

  if (status === "idle") {
    return (
      <div className="flex items-center justify-center h-full border-2 border-dashed rounded-lg bg-muted/50 p-8 text-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <BarChart className="h-12 w-12" />
            <p className="font-semibold">Your summary will appear here</p>
            <p className="text-sm">Fill out the form to get started.</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
      // Errors are now handled by toast, we can keep the idle state.
      return (
        <div className="flex items-center justify-center h-full border-2 border-dashed rounded-lg bg-muted/50 p-8 text-center">
          <div className="flex flex-col items-center gap-2 text-destructive">
              <AlertCircle className="h-12 w-12" />
              <p className="font-semibold">Something went wrong</p>
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
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="flex justify-between items-start">
        <h2 className="text-2xl font-bold font-headline">Analysis Results</h2>
        <ExportButton result={result} />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generated Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap font-body">
            {result.summary}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ThumbsUp className="h-5 w-5" />
            Quality Score
          </CardTitle>
          <CardDescription>
            AI-powered evaluation of the summary's clarity and relevance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-primary">{qualityPercentage}%</span>
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
  );
}
