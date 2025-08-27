import { ScanText } from 'lucide-react';

export function Header() {
  return (
    <div className="text-center space-y-2">
       <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4 border border-primary/20">
        <ScanText className="h-10 w-10 text-primary" />
      </div>
      <h1 className="text-5xl font-extrabold font-headline tracking-tight">DocuSense</h1>
    </div>
  );
}
