'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

declare global {
  interface Window {
    adsbygoogle: any;
  }
}

export default function AdBanner({ className }: { className?: string }) {
  const insRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    // Check if the ad slot has already been filled.
    // AdSense adds a `data-adsbygoogle-status` attribute when an ad is loaded.
    if (insRef.current && insRef.current.getAttribute('data-adsbygoogle-status') === 'done') {
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <div
      className={cn(
        "flex items-center justify-center w-full min-h-[100px] bg-muted/50 rounded-lg",
        className
      )}
    >
      <div className="w-full">
        {/* The script part is already in layout.tsx */}
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-9498357581912172"
          data-ad-slot="7632982316"
          data-ad-format="autorelaxed"
        ></ins>
      </div>
    </div>
  );
}
