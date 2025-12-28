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
      <ins
        className="adsbygoogle w-full"
        style={{ display: 'block' }}
        data-ad-format="fluid"
        data-ad-layout-key="-fb+5w+4e-db+86"
        data-ad-client="ca-pub-9498357581912172"
        data-ad-slot="9616325433"
      ></ins>
    </div>
  );
}
