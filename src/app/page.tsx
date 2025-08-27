
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
import { Wand2, Type, Upload, FileText as FileTextIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [inputType, setInputType] = React.useState("text");
  const [fileName, setFileName] = React.useState("");
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName("");
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
       <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="container mx-auto p-4 py-8 md:p-12 flex flex-col items-center">
        <div className="w-full max-w-3xl space-y-8">
          <Header />
          <p className="text-center text-lg text-muted-foreground">
            Paste your document content, choose your summary type, and let our AI provide a clear analysis.
          </p>

          <form action={formAction} className="space-y-8">
             <Tabs defaultValue="text" onValueChange={setInputType} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="text"><Type className="mr-2 h-4 w-4"/>Paste Text</TabsTrigger>
                    <TabsTrigger value="file"><Upload className="mr-2 h-4 w-4"/>Upload File</TabsTrigger>
                </TabsList>
                <input type="hidden" name="inputType" value={inputType} />
                <TabsContent value="text">
                    <Card className="border-primary/20 shadow-lg shadow-primary/5 mt-4">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                            <FileTextIcon className="h-6 w-6 text-primary" />
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
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="file">
                    <Card className="border-primary/20 shadow-lg shadow-primary/5 mt-4">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <Upload className="h-6 w-6 text-primary" />
                                <span className="text-2xl">Upload Document</span>
                            </CardTitle>
                            <CardDescription>
                                Upload a .txt or .pdf file for analysis. Max file size: 4MB.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-center w-full">
                                <Label htmlFor="documentFile" className="flex flex-col items-center justify-center w-full h-48 border-2 border-primary/30 border-dashed rounded-lg cursor-pointer bg-secondary hover:bg-secondary/80">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-4 text-primary" />
                                        {fileName ? (
                                             <p className="font-semibold text-primary">{fileName}</p>
                                        ): (
                                            <>
                                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                <p className="text-xs text-muted-foreground">TXT or PDF (MAX. 4MB)</p>
                                            </>
                                        )}
                                    </div>
                                    <Input id="documentFile" name="documentFile" type="file" className="hidden" accept=".txt,.pdf" onChange={handleFileChange} />
                                </Label>
                            </div> 
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>


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
      </div>
    </div>
  );
}
