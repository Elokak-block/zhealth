'use client';

import Link from 'next/link';
import { Activity } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

const AdUnit = () => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adContainerRef.current && adContainerRef.current.children.length === 0) {
      const optionsScript = document.createElement('script');
      optionsScript.innerHTML = `atOptions = { 'key' : '776d2d1dc730da4da753c518c38c4243', 'format' : 'iframe', 'height' : 50, 'width' : 320, 'params' : {} };`;
      
      const invokeScript = document.createElement('script');
      invokeScript.src = 'https://www.highperformanceformat.com/776d2d1dc730da4da753c518c38c4243/invoke.js';
      invokeScript.async = true;

      adContainerRef.current.appendChild(optionsScript);
      adContainerRef.current.appendChild(invokeScript);
    }
  }, []);

  return <div ref={adContainerRef} className="w-full flex justify-center items-center h-[50px]"></div>;
};


export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <header className="px-4 lg:px-6 h-auto flex-col items-center justify-center">
      <div className="h-20 flex items-center justify-between w-full">
        <Link href="/" className="flex items-center justify-center" prefetch={false}>
          <Activity className="h-6 w-6 text-primary" />
          <span className="ml-3 text-xl font-semibold">Zuty Health</span>
        </Link>
      </div>
      {isHomePage && <AdUnit />}
    </header>
  );
}
