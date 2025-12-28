import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Zuty Health - Lifestyle Strain Assessment & Wellness Insight Tool',
  description: 'Check your lifestyle strain score with our non-diagnostic health assessment. Get insights into how your daily habits impact your long-term health and wellness.',
  keywords: 'lifestyle strain assessment, health pattern analysis, wellness insight tool, daily habits, non-medical health check, lifestyle risk checker, health pattern analysis, lifestyle habits AI insights, wellness AI score, behavior pattern analysis, lifestyle improvement AI tool, habit-driven health insights, wellness score, lifestyle score, daily routine analysis, preventive health tool, habit score, self-assessment health tool, stress and sleep analysis, diet and exercise patterns, non-diagnostic wellness tool, long-term health impact',
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
        <div className="relative flex flex-col min-h-screen">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
          >
            <div className="absolute left-[25%] top-[5%] h-[30rem] w-[30rem] rounded-full bg-primary/10 blur-[10rem] filter" />
            <div className="absolute right-[25%] top-[20%] h-[30rem] w-[30rem] rounded-full bg-accent/10 blur-[10rem] filter" />
          </div>
          <div className="relative z-10 flex-1 flex flex-col">{children}</div>
           <footer className="w-full py-6">
            <div className="container mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between text-center gap-4">
              <p className="text-xs text-muted-foreground">
                &copy; 2025 Zuty Health. All rights reserved.
              </p>
              <nav className="flex gap-4 sm:gap-6 text-xs text-muted-foreground flex-wrap justify-center">
                <Link href="/about" className="hover:text-foreground">About</Link>
                <Link href="/contact" className="hovertext-foreground">Contact</Link>
                <Link href="/faq" className="hover:text-foreground">FAQ</Link>
                <Link href="/terms" className="hover:text-foreground">Terms</Link>
                <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
                <Link href="/disclaimer" className="hover:text-foreground">Disclaimer</Link>
              </nav>
            </div>
          </footer>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
