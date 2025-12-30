'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Header from '@/components/header';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                  Understand Your Lifestyle Strain Score
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Our wellness insight tool provides a non-diagnostic health check by analyzing your daily habits. Discover how your lifestyle patterns affect your long-term health, from stress and diet to sleep quality. No data is ever stored.
                </p>
              </div>
              <div className="space-y-2">
                 <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-lg">
                    <Link href="/assessment">Check My Lifestyle Strain</Link>
                  </Button>
                <p className="text-xs text-muted-foreground">
                  No sign-up · No data stored · 2–3 minutes
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
