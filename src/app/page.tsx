"use client";

import React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { generateSummaryAction, type FormState } from "./actions";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/docusense/header";
import { SummaryResults } from "@/components/docusense/summary-results";
import { ClipboardPaste, Sparkles } from "lucide-react";

const initialState: FormState = {
  status: "idle",
  message: "",
  result: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Sparkles className="mr-2 h-4 w-4 animate-spin" />
          Summarizing...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Generate Summary
        </>
      )}
    </Button>
  );
}

export default function Home() {
  const [state, formAction] = useFormState(generateSummaryAction, initialState);
  const [summaryType, setSummaryType] = React.useState("quick");
  const { toast } = useToast();

  React.useEffect(() => {
    if (state.status === "error") {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4 py-8 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-16 gap-8">
          <div className="flex flex-col space-y-6">
            <Header />
            <p className="text-muted-foreground">
              Welcome to DocuSense. Paste your document content below, choose a summary type, and let our AI provide you with a concise or in-depth analysis.
            </p>

            <form action={formAction} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardPaste className="h-5 w-5" />
                    Document Content
                  </CardTitle>
                  <CardDescription>
                    Paste the full text from your .txt or .pdf file here.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    name="documentContent"
                    placeholder="Start by pasting your document content here..."
                    className="min-h-[250px] text-base resize-y"
                    required
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                   <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Summary Options
                  </CardTitle>
                  <CardDescription>
                    Select the type of summary you want to generate.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="quick" onValueChange={setSummaryType} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="quick">Quick Summary</TabsTrigger>
                      <TabsTrigger value="deep">Deep Summary</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <input type="hidden" name="summaryType" value={summaryType} />
                </CardContent>
              </Card>
              
              <div className="flex justify-start">
                <SubmitButton />
              </div>

            </form>
          </div>
          
          <div className="lg:pt-24">
             <SummaryResults state={state} />
          </div>
        </div>
      </div>
    </main>
  );
}
