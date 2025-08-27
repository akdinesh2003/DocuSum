import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer } from "lucide-react";

interface SentimentMeterProps {
  sentiment: "positive" | "negative" | "neutral" | string | null;
  tone: string | null;
}

export function SentimentMeter({ sentiment, tone }: SentimentMeterProps) {
  const sentimentText = sentiment ? sentiment.charAt(0).toUpperCase() + sentiment.slice(1) : 'N/A';
  
  return (
    <Card className="bg-secondary/50 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl">
            <Thermometer className="h-5 w-5 text-primary"/>
            Sentiment & Tone
        </CardTitle>
        <CardDescription>
          The emotional leaning and style of the document.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-center text-2xl font-semibold mb-2">{sentimentText}</p>
          <div className="relative w-full h-3 rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 overflow-hidden">
             <div 
                className={cn(
                  "absolute top-0 bottom-0 w-2.5 h-3.5 -mt-[1px] bg-foreground border border-background rounded-sm transform -translate-x-1/2 transition-all duration-500 ease-in-out",
                  {
                    'left-[10%]': sentiment === 'negative',
                    'left-1/2': sentiment === 'neutral',
                    'left-[90%]': sentiment === 'positive',
                    'hidden': !sentiment
                  }
                )}
             />
          </div>
           <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Negative</span>
            <span>Neutral</span>
            <span>Positive</span>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-1">Detected Tone</h4>
          <p className="text-muted-foreground text-sm font-mono p-2 bg-background/50 rounded-md">{tone || "Not available"}</p>
        </div>
      </CardContent>
    </Card>
  );
}
