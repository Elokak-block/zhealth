'use client';

import { useEffect } from 'react';
import { cn } from '@/lib/utils';

declare global {
  interface Window {
    adsbygoogle: any;
  }
}

export default function AdBanner({ className }: { className?: string }) {
  useEffect(() => {
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
        <ins className="adsbygoogle"
            style={{display: 'block'}}
            data-ad-client="ca-pub-9498357581912172"
            data-ad-slot="7632982316"
            data-ad-format="autorelaxed"
            ></ins>
       </div>
    </div>
  );
}
