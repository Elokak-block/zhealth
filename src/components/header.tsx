'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Activity } from 'lucide-react';
import { Button } from './ui/button';

export default function Header() {
  const router = useRouter();

  return (
    <header className="px-4 lg:px-6 h-20 flex items-center">
      <Link href="/" className="flex items-center justify-center" prefetch={false}>
        <Activity className="h-6 w-6 text-primary" />
        <span className="ml-3 text-xl font-semibold">Zuty Health</span>
      </Link>
    </header>
  );
}
