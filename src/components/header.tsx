'use client';

import Link from 'next/link';
import { Activity } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Ad banner component
const AdBanner = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.innerHTML = `(function(s){s.dataset.zone='10395534',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`;
    document.body.appendChild(script);

    return () => {
      // This is a best-effort cleanup.
      const adScript = document.querySelector('script[src="https://nap5k.com/tag.min.js"]');
      if (adScript) {
        adScript.remove();
      }
      const adElement = document.querySelector('div[data-zone="10395534"]');
       if (adElement) {
        adElement.remove();
      }
    };
  }, []);

  return null;
};


export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <header className="px-4 lg:px-6 h-20 flex items-center justify-between">
      <Link href="/" className="flex items-center justify-center" prefetch={false}>
        <Activity className="h-6 w-6 text-primary" />
        <span className="ml-3 text-xl font-semibold">Zuty Health</span>
      </Link>
      
    </header>
  );
}
