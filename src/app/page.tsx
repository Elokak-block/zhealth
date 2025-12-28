import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, HeartPulse, BrainCircuit, ShieldCheck, Soup } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/header';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Discover Your Lifestyle Strain Score
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Vitality Compass helps you understand your lifestyle habits and their link to potential health risks—no diagnoses, just insightful data for a healthier you.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href="/assessment">Start Your Free Assessment</Link>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Takes about 5 minutes. No sign-up required.
                </p>
              </div>
              <Card className="w-full max-w-md shadow-lg">
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                  <CardDescription>We assess five key pillars of your lifestyle.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-muted p-3 flex items-center justify-center">
                      <Soup className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Metabolic Load</h3>
                      <p className="text-sm text-muted-foreground">Diet, sugar intake, and energy levels.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-muted p-3 flex items-center justify-center">
                      <Leaf className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Inflammatory Habits</h3>
                      <p className="text-sm text-muted-foreground">Sleep, stress, and substance use.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-muted p-3 flex items-center justify-center">
                      <HeartPulse className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Cardiovascular Strain</h3>
                      <p className="text-sm text-muted-foreground">Activity levels and physical signs.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-muted p-3 flex items-center justify-center">
                      <BrainCircuit className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Hormonal & Stress Load</h3>
                      <p className="text-sm text-muted-foreground">Sleep quality and mental well-being.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-muted p-3 flex items-center justify-center">
                      <ShieldCheck className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Lifestyle Stability</h3>
                      <p className="text-sm text-muted-foreground">Routine, stress, and social support.</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-xs text-muted-foreground">This tool does not provide medical advice. Consult a healthcare professional for medical concerns.</p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex items-center justify-center py-4 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 Vitality Compass. All rights reserved.</p>
      </footer>
    </div>
  );
}
