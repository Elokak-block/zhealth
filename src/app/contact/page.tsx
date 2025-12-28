import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-3xl">
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="text-3xl font-semibold">Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>Have questions, feedback, or concerns?</p>
              <p>We’d love to hear from you.</p>
              <p className="text-lg text-foreground pt-4">
                📧 Email:{' '}
                <a
                  href="mailto:support@zutyhealth.com"
                  className="text-primary hover:underline"
                >
                  support@zutyhealth.com
                </a>
              </p>
              <div className="pt-4">
                <h4 className="font-semibold text-foreground">Please note:</h4>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>We do not provide medical, legal, or professional advice.</li>
                  <li>
                    We do not respond to requests for personalized diagnoses or
                    treatment recommendations.
                  </li>
                  <li>We aim to respond within 48 hours.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
