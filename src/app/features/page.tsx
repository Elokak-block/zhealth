
import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Activity, Users, Share2 } from 'lucide-react';

const features = [
  {
    icon: <Activity className="h-8 w-8 text-primary" />,
    title: 'Lifestyle Strain Index (LSI)',
    description: 'Calculates a single, easy-to-understand score (0-100) reflecting your overall lifestyle strain based on scientifically-backed health pillars.',
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: 'Dynamic Question Engine',
    description: 'A quick, intuitive assessment with 30-35 questions about your daily habits, diet, stress, and sleep patterns.',
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'Personalized Result Tiers',
    description: 'Presents results within psychologically safe tiers (Low, Moderate, High, Critical) with clear explanations of primary risk drivers and actionable changes.',
  },
  {
    icon: <Share2 className="h-8 w-8 text-primary" />,
    title: 'Shareable Results',
    description: 'Generates a simple, shareable image of your score and tier, perfect for sharing with friends or healthcare providers.',
  },
];

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-4xl text-center">
            <Card className="bg-card/50">
                <CardHeader>
                <CardTitle className="text-3xl font-semibold">Features</CardTitle>
                <p className="text-muted-foreground pt-2">What our wellness tool offers.</p>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6 text-left">
                {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
                        <div>{feature.icon}</div>
                        <div>
                            <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                            <p className="text-muted-foreground mt-1">{feature.description}</p>
                        </div>
                    </div>
                ))}
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
