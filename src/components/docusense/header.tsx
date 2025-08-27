import { ScanText } from 'lucide-react';

export function Header() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center p-2 bg-primary/10 rounded-lg">
        <ScanText className="h-8 w-8 text-primary" />
      </div>
      <h1 className="text-3xl font-bold font-headline tracking-tight">DocuSense</h1>
    </div>
  );
}
