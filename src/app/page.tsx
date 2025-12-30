'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Header from '@/components/header';
import { useEffect } from 'react';

const AdUnit = () => {
  useEffect(() => {
    // Create the options script
    const optionsScript = document.createElement('script');
    optionsScript.innerHTML = `atOptions = { 'key' : '776d2d1dc730da4da753c518c38c4243', 'format' : 'iframe', 'height' : 50, 'width' : 320, 'params' : {} };`;
    document.body.appendChild(optionsScript);

    // Create the main ad script
    const invokeScript = document.createElement('script');
    invokeScript.src = 'https://www.highperformanceformat.com/776d2d1dc730da4da753c518c38c4243/invoke.js';
    invokeScript.async = true;
    document.body.appendChild(invokeScript);

    // Cleanup function to remove scripts when component unmounts
    return () => {
      document.body.removeChild(optionsScript);
      document.body.removeChild(invokeScript);
    };
  }, []);

  return null;
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <AdUnit />
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