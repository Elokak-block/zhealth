import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function DisclaimerPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-3xl">
          <Card className="bg-card/50 border-accent/50">
            <CardHeader>
              <CardTitle className="text-3xl font-semibold flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-accent" />
                Disclaimer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p className="text-lg text-foreground">
                This website does not provide medical advice, diagnosis, or
                treatment.
              </p>
              <p>
                All tools, results, scores, and insights are:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>For informational and educational purposes only</li>
                <li>
                  Based on generalized logic and self-reported input
                </li>
                <li>Not a substitute for professional consultation</li>
              </ul>
              <p className="pt-2">
                No content on this site should be interpreted as:
              </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Medical diagnosis</li>
                    <li>Health risk prediction</li>
                    <li>Professional recommendation</li>
                </ul>
              <p className="font-semibold text-foreground pt-4">
                If you have health concerns, symptoms, or medical conditions,
                consult a qualified professional.
              </p>
              <p className="pt-2">
                By using this website, you agree that:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  You are solely responsible for how you interpret and use the
                  information
                </li>
                <li>
                  The website and its creators are not liable for any outcomes
                  or decisions
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
