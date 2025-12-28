import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Vitality Compass',
  description: 'Evaluate your lifestyle strain and health risk indicators.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'min-h-screen font-body bg-background antialiased',
        )}
      >
        <main className="relative flex flex-col min-h-screen">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
          >
            <div className="absolute left-[25%] top-[5%] h-[30rem] w-[30rem] rounded-full bg-primary/10 blur-[10rem] filter" />
            <div className="absolute right-[25%] top-[20%] h-[30rem] w-[30rem] rounded-full bg-accent/10 blur-[10rem] filter" />
          </div>
          <div className="relative z-10 flex-1 flex flex-col">{children}</div>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
