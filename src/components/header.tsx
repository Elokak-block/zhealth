'use client';

import Link from 'next/link';
import { Activity } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

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
