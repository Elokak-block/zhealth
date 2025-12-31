'use client';

import Link from 'next/link';
import { Activity } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { AdUnit } from '@/components/ad-unit';
import { AdUnitTwo } from '@/components/ad-unit-two';


export default function Header() {
  const pathname = usePathname();
  // Show ad on home, assessment, and results pages
  const showAd = ['/', '/assessment', '/results'].includes(pathname);

  return (
    <header className="px-4 lg:px-6 h-auto flex flex-col items-center justify-center">
      <div className="h-20 flex items-center justify-between w-full max-w-5xl mx-auto">
        <Link href="/" className="flex items-center justify-center" prefetch={false}>
          <Activity className="h-6 w-6 text-primary" />
          <span className="ml-3 text-xl font-semibold">Zuty Health</span>
        </Link>
      </div>
      {showAd && (
        <>
          <AdUnitTwo adKey="header-ad-two" />
          <AdUnit adKey="header-ad" />
        </>
      )}
    </header>
  );
}
