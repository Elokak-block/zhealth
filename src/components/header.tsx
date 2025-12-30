'use client';

import Link from 'next/link';
import { Activity } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

const AdUnit = () => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if scripts are already there to prevent duplication on re-renders
    if (adContainerRef.current && adContainerRef.current.children.length === 0) {
      const optionsScript = document.createElement('script');
      optionsScript.innerHTML = `atOptions = { 'key' : '776d2d1dc730da4da753c518c38c4243', 'format' : 'iframe', 'height' : 50, 'width' : 320, 'params' : {} };`;
      
      const invokeScript = document.createElement('script');
      invokeScript.src = 'https://www.highperformanceformat.com/776d2d1dc730da4da753c518c38c4243/invoke.js';
      invokeScript.async = true;

      // Append scripts to the ref'd div
      adContainerRef.current.appendChild(optionsScript);
      adContainerRef.current.appendChild(invokeScript);
    }
  }, []);

  return (
    // This outer container ensures the ad unit has a defined space and is centered.
    <div className="w-full flex justify-center items-center h-[50px]">
      <div ref={adContainerRef}></div>
    </div>
  );
};


export default function Header() {
  const pathname = usePathname();
  const showAd = ['/', '/assessment', '/results'].includes(pathname);

  return (
    <header className="px-4 lg:px-6 h-auto flex flex-col items-center justify-center">
      <div className="h-20 flex items-center justify-between w-full max-w-5xl mx-auto">
        <Link href="/" className="flex items-center justify-center" prefetch={false}>
          <Activity className="h-6 w-6 text-primary" />
          <span className="ml-3 text-xl font-semibold">Zuty Health</span>
        </Link>
      </div>
      {showAd && <AdUnit />}
    </header>
  );
}
