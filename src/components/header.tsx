'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Activity, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

export default function Header() {
  const router = useRouter();

  // A simple check to see if there's a history to go back to.
  // This depends on the browser's history stack.
  // In a more complex app, we might manage this state.
  const canGoBack = typeof window !== 'undefined' && window.history.length > 1;

  return (
    <header className="px-4 lg:px-6 h-20 flex items-center justify-between">
      <Link href="/" className="flex items-center justify-center" prefetch={false}>
        <Activity className="h-6 w-6 text-primary" />
        <span className="ml-3 text-xl font-semibold">Zuty Health</span>
      </Link>
       {canGoBack && (
         <Button variant="ghost" onClick={() => router.back()}>
           <ArrowLeft className="mr-2 h-4 w-4" />
           Back
         </Button>
       )}
    </header>
  );
}
