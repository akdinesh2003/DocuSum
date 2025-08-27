
"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { generateSummaryAction, type FormState } from "./actions";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/docusense/header";
import { SummaryResults } from "@/components/docusense/summary-results";
import { Wand2, Type } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const initialState: FormState = {
  status: "idle",
  message: "",
  result: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full sm:w-auto">
      {pending ? (
        <>
          <Wand2 className="mr-2 h-5 w-5 animate-spin" />
          Analyzing Document...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-5 w-5" />
          Generate Summary
        </>
      )}
    </Button>
  );
}

export default function Home() {
  const [state, formAction] = useActionState(generateSummaryAction, initialState);
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
      <div className="container mx-auto p-4 py-8 md:p-12 flex flex-col items-center">
        <div className="w-full max-w-3xl space-y-8">
          <Header />
          <p className="text-center text-lg text-muted-foreground">
            Paste your document content, choose your summary type, and let our AI provide a clear analysis.
          </p>

          <form action={formAction} className="space-y-8">
            <Card className="border-primary/20 shadow-lg shadow-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Type className="h-6 w-6 text-primary" />
                  <span className="text-2xl">Document Content</span>
                </CardTitle>
                <CardDescription>
                  Paste the full text from your document here. Minimum 50 characters.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  name="documentContent"
                  placeholder="Start by pasting your document content here..."
                  className="min-h-[300px] text-base resize-y bg-secondary border-primary/30 focus-visible:ring-primary"
                  required
                />
              </CardContent>
            </Card>

            <Card className="border-primary/20 shadow-lg shadow-primary/5">
              <CardHeader>
                 <CardTitle className="flex items-center gap-3">
                  <Wand2 className="h-6 w-6 text-primary" />
                  <span className="text-2xl">Summary Options</span>
                </CardTitle>
                <CardDescription>
                  Select the type of summary you want to generate.
                </CardDescription>
              </CardHeader>
              <CardContent>
                 <RadioGroup defaultValue="quick" onValueChange={setSummaryType} className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="quick" id="r1" />
                      <Label htmlFor="r1" className="text-base">Quick Summary</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="deep" id="r2" />
                      <Label htmlFor="r2" className="text-base">Deep Analysis</Label>
                    </div>
                  </RadioGroup>
                <input type="hidden" name="summaryType" value={summaryType} />
              </CardContent>
            </Card>
            
            <div className="flex justify-center pt-4">
              <SubmitButton />
            </div>
          </form>
          
          <div className="w-full">
             <SummaryResults state={state} />
          </div>
        </div>
      </div>
    </main>
  );
}
