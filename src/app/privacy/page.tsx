
import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-3xl">
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="text-3xl font-semibold">Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-muted-foreground">
              <div>
                <h4 className="text-lg font-semibold text-foreground">1. Information We Collect</h4>
                <p className="mt-2">We may collect:</p>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li>Non-personal usage data (browser type, device, pages visited)</li>
                  <li>Anonymous responses entered into tools</li>
                </ul>
                <p className="mt-2">We do not collect:</p>
                 <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li>Medical records</li>
                  <li>Government IDs</li>
                  <li>Payment information (unless stated otherwise)</li>
                </ul>
              </div>
               <div>
                <h4 className="text-lg font-semibold text-foreground">2. How We Use Information</h4>
                <p className="mt-2">Data is used to:</p>
                 <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li>Improve site performance</li>
                  <li>Enhance user experience</li>
                  <li>Analyze usage trends</li>
                </ul>
              </div>
               <div>
                <h4 className="text-lg font-semibold text-foreground">3. Data Sharing</h4>
                <p className="mt-2">
                  We do not sell or rent personal data. Limited data may be
                  shared with analytics or advertising partners in anonymized
                  form.
                </p>
              </div>
               <div>
                <h4 className="text-lg font-semibold text-foreground">4. Cookies</h4>
                <p className="mt-2">
                  We may use cookies for analytics and advertising purposes. You
                  can disable cookies in your browser settings.
                </p>
              </div>
               <div>
                <h4 className="text-lg font-semibold text-foreground">5. Data Security</h4>
                <p className="mt-2">
                  We implement reasonable safeguards but cannot guarantee
                  absolute security.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
