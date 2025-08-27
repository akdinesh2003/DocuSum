"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";
import type { SummaryResult } from "@/app/actions";

interface ExportButtonProps {
  result: SummaryResult;
}

export function ExportButton({ result }: ExportButtonProps) {

  const createMarkdownContent = () => {
    let content = `
# Document Summary

## Generated Summary
${result.summary}

---

## Analysis

**Quality Score:** ${Math.round(result.qualityScore * 100)}%
*Justification: ${result.justification}*
`;
    if (result.sentiment && result.tone) {
      content += `
**Sentiment:** ${result.sentiment}
**Tone:** ${result.tone}
`;
    }
    return content.trim();
  };

  const createTextContent = () => {
    let content = `
DOCUMENT SUMMARY
================

GENERATED SUMMARY
-----------------
${result.summary}

-----------------

ANALYSIS
--------
Quality Score: ${Math.round(result.qualityScore * 100)}%
Justification: ${result.justification}
`;
    if (result.sentiment && result.tone) {
      content += `
Sentiment: ${result.sentiment}
Tone: ${result.tone}
`;
    }
    return content.trim();
  };

  const handleExport = (format: "md" | "txt") => {
    const content = format === "md" ? createMarkdownContent() : createTextContent();
    const blob = new Blob([content], { type: `text/${format === "md" ? "markdown" : "plain"}` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `text-summarizer-summary.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("md")}>
          Save as Markdown (.md)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("txt")}>
          Save as Text (.txt)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
