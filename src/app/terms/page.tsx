import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-3xl">
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="text-3xl font-semibold">Terms of Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-muted-foreground">
               <p>
                By accessing or using this website, you agree to the following
                terms.
              </p>
              <div>
                <h4 className="text-lg font-semibold text-foreground">1. Use of the Website</h4>
                <p className="mt-2">
                  This website provides informational and educational content
                  only. You agree to use it for lawful purposes and not to
                  misuse, abuse, or attempt to exploit the system.
                </p>
              </div>
               <div>
                <h4 className="text-lg font-semibold text-foreground">2. No Professional Advice</h4>
                <p className="mt-2">
                  The content and results provided are not medical, legal,
                  financial, or professional advice. Nothing on this site should
                  be considered a diagnosis or treatment recommendation.
                </p>
              </div>
               <div>
                <h4 className="text-lg font-semibold text-foreground">3. Accuracy of Information</h4>
                <p className="mt-2">
                  You agree to provide accurate responses when using our tools.
                  Results are generated based on user input and generalized
                  logic and may not reflect real-world outcomes.
                </p>
              </div>
               <div>
                <h4 className="text-lg font-semibold text-foreground">4. Limitation of Liability</h4>
                <p className="mt-2">
                  We are not liable for any decisions, actions, or outcomes
                  resulting from the use of this website.
                </p>
              </div>
               <div>
                <h4 className="text-lg font-semibold text-foreground">5. Changes</h4>
                <p className="mt-2">
                  We may update these terms at any time. Continued use of the
                  site means you accept the updated terms.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
