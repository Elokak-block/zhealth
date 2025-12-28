import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-3xl">
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="text-3xl font-semibold">About Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We build simple tools that help people reflect on their
                lifestyle, habits, and daily patterns.
              </p>
              <p>
                Our platforms are designed to offer insight, awareness, and
                comparison, not diagnoses or professional advice. We believe
                that small behavioral awareness can lead to better long-term
                decisions.
              </p>
              <h4 className="text-lg font-semibold text-foreground pt-4">
                Our goal is to create tools that are:
              </h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>Easy to use</li>
                <li>Honest and transparent</li>
                <li>
                  Focused on self-reflection, not judgment
                </li>
              </ul>
              <p className="pt-4">
                All results provided are informational and educational only.
                Users are always encouraged to make their own decisions and seek
                professional guidance when needed.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
