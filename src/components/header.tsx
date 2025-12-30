'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity } from 'lucide-react';
import { useEffect } from 'react';

const AdScript = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.innerHTML = `(function(s){s.dataset.zone='10395534',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`;
    document.head.appendChild(script);

    return () => {
      // Clean up the script when the component unmounts
      // Note: The injected script might not be removable this way if it modifies the DOM further.
      // We can look for it by its src if needed.
    };
  }, []);

  return null;
};


export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <>
      {isHomePage && <AdScript />}
      <header className="px-4 lg:px-6 h-20 flex items-center">
        <Link href="/" className="flex items-center justify-center" prefetch={false}>
          <Activity className="h-6 w-6 text-primary" />
          <span className="ml-3 text-xl font-semibold">Zuty Health</span>
        </Link>
      </header>
    </>
  );
}
