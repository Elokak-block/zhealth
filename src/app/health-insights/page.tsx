
import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HealthInsightsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-3xl text-center">
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="text-3xl font-semibold">Connecting Habits to Health</CardTitle>
               <p className="text-muted-foreground pt-2">Our goal is to help you see the bigger picture.</p>
            </CardHeader>
            <CardContent className="space-y-6 text-muted-foreground text-left">
              <div>
                <h4 className="text-lg font-semibold text-foreground">Why Lifestyle Strain Matters</h4>
                <p className="mt-2">
                  Many chronic health issues are linked to long-term lifestyle patterns. Small, seemingly minor habits related to diet, sleep, activity, and stress can accumulate over time, creating significant strain on your body. The Lifestyle Strain Index isn't a diagnosis—it's a reflection of these accumulated patterns.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-foreground">Using Your Insights</h4>
                <p className="mt-2">
                 Your results are designed to be a starting point for self-reflection. Use the "Areas for Improvement" to identify specific habits you could adjust. A high strain in "Sleep," for example, might prompt you to re-evaluate your bedtime routine. A low score in "Diet" could encourage more mindful eating.
                </p>
              </div>
               <div className="text-center pt-4">
                 <Button asChild>
                    <Link href="/assessment">Check Your Score Now</Link>
                 </Button>
               </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
