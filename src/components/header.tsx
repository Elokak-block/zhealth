import Link from 'next/link';
import { Activity } from 'lucide-react';

export default function Header() {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center shadow-sm">
      <Link href="/" className="flex items-center justify-center" prefetch={false}>
        <Activity className="h-6 w-6 text-primary" />
        <span className="ml-2 text-xl font-semibold font-headline">Vitality Compass</span>
      </Link>
    </header>
  );
}
