'use client';

import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toPng } from 'html-to-image';
import QRCode from 'qrcode.react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { calculateScores } from '@/lib/scoring';
import { generateRiskSignalExplanations } from '@/ai/flows/generate-risk-signal-explanations';
import { connectUsersWithSimilarPatterns } from '@/ai/flows/connect-users-with-similar-patterns';
import type { AnswerSet, ResultData, PillarId } from '@/lib/types';
import { PILLARS } from '@/lib/types';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Download, Info, MessageSquare, Users } from 'lucide-react';

type RiskExplanation = { title: string; explanation: string; suggestions: string[] };
type CommunitySuggestion = { communityTopicSuggestion: string; suggestedResources: string[] };

export default function ResultsClient({ data }: { data?: string }) {
  const router = useRouter();
  const [riskExplanations, setRiskExplanations] = useState<RiskExplanation[]>([]);
  const [communitySuggestion, setCommunitySuggestion] = useState<CommunitySuggestion | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(true);
  const shareableRef = useRef<HTMLDivElement>(null);

  const resultData: ResultData | null = useMemo(() => {
    if (!data) return null;
    try {
      const answers: AnswerSet = JSON.parse(atob(data));
      return calculateScores(answers);
    } catch (error) {
      console.error('Failed to parse result data:', error);
      return null;
    }
  }, [data]);

  useEffect(() => {
    if (resultData) {
      const fetchAIData = async () => {
        setIsLoadingAI(true);
        try {
          const explanationPromises = resultData.riskFlags.map((flag) =>
            generateRiskSignalExplanations({
              riskSignal: flag,
              pillarBreakdown: resultData.pillarScores,
              primaryRiskDrivers: resultData.primaryRiskDrivers.map(d => d.questionText),
            }).then(res => ({ ...res, title: flag }))
          );
          
          const [communityRes, ...explanationRes] = await Promise.all([
            connectUsersWithSimilarPatterns({
              lifestyleStrainIndex: resultData.lifestyleStrainIndex,
              riskAlignmentFlags: resultData.riskFlags,
              pillarBreakdown: resultData.pillarScores,
            }),
            ...explanationPromises
          ]);

          setRiskExplanations(explanationRes);
          setCommunitySuggestion(communityRes);
        } catch (error) {
          console.error('AI Flow failed:', error);
        } finally {
          setIsLoadingAI(false);
        }
      };
      fetchAIData();
    }
  }, [resultData]);

  const handleDownloadImage = useCallback(() => {
    if (shareableRef.current === null) return;
    toPng(shareableRef.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'vitality-compass-results.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => console.error(err));
  }, []);

  if (!resultData) {
    return (
      <div className="container mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Could not load results.</h2>
        <p className="mb-4">The data may be invalid. Please try the assessment again.</p>
        <Button onClick={() => router.push('/assessment')}>Try Again</Button>
      </div>
    );
  }

  const chartData = Object.keys(resultData.pillarScores).map((pillar) => ({
    name: PILLARS[pillar as PillarId].name.split(' & ')[0],
    score: resultData.pillarScores[pillar as PillarId],
  }));

  const getBarColor = (score: number) => {
    if (score <= 25) return 'hsl(var(--primary))';
    if (score <= 70) return 'hsl(var(--accent))';
    return 'hsl(var(--destructive))';
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 space-y-8">
      {/* Main Score */}
      <Card className="text-center shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-headline text-muted-foreground">Your Lifestyle Strain Index</CardTitle>
          <p className="text-7xl font-bold text-primary">{resultData.lifestyleStrainIndex}</p>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">{resultData.tier.name}</p>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">{resultData.tier.description}</p>
        </CardContent>
        <CardFooter className="flex justify-center">
           <Button onClick={() => router.push('/assessment')}>Take Assessment Again</Button>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Pillar Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Pillar Breakdown</CardTitle>
              <CardDescription>How your habits contribute to your score across different areas of your life.</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} layout="vertical" margin={{ left: 40, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={100} tickLine={false} axisLine={false} />
                  <RechartsTooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{ backgroundColor: 'hsl(var(--background))' }} />
                  <Bar dataKey="score" barSize={20}>
                    {chartData.map((entry, index) => (
                       <rect key={`cell-${index}`} fill={getBarColor(entry.score)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {/* Risk Signal Explanations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Info /> What This Means</CardTitle>
              <CardDescription>Based on your answers, here are some non-diagnostic lifestyle patterns we observed.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingAI ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : riskExplanations.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {riskExplanations.map((item, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                      <AccordionTrigger className="font-semibold text-left">{item.title}</AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <p>{item.explanation}</p>
                        <h4 className="font-semibold">What You Can Change First:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                          {item.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <p className="text-muted-foreground">No specific risk signals were prominently flagged based on your responses. Continue maintaining a balanced lifestyle.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-8">
          {/* Community CTA */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Users/> Community Connection</CardTitle>
              <CardDescription>Others with similar patterns are discussing these topics.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingAI ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ) : communitySuggestion ? (
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold flex items-center gap-2"><MessageSquare size={16}/> Suggested Topic</h4>
                    <p className="text-sm">{communitySuggestion.communityTopicSuggestion}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Helpful Resources:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                       {communitySuggestion.suggestedResources.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                </div>
              ) : <p>Could not load community suggestions.</p>}
            </CardContent>
          </Card>
          
          {/* Shareable Result */}
           <Card>
            <CardHeader>
              <CardTitle>Share Your Results</CardTitle>
              <CardDescription>Download a summary of your results to share or keep.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <div ref={shareableRef} className="p-6 bg-background border border-border rounded-lg w-full">
                 <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-bold font-headline text-primary">Vitality Compass</h3>
                        <p className="text-sm text-muted-foreground">My Lifestyle Strain Score</p>
                        <p className="text-6xl font-bold">{resultData.lifestyleStrainIndex}</p>
                        <p className="text-xl font-semibold">{resultData.tier.name}</p>
                    </div>
                    <QRCode value={typeof window !== 'undefined' ? window.location.href : ''} size={80} level="L" bgColor="transparent" fgColor="hsl(var(--foreground))" />
                 </div>
                 <p className="text-[10px] text-muted-foreground mt-4">This is not medical advice. Consult a doctor for health concerns. Results generated at vitality-compass.app</p>
              </div>
              <Button onClick={handleDownloadImage} className="w-full"><Download className="mr-2"/> Download Image</Button>
            </CardContent>
          </Card>

        </div>
      </div>

      <Alert variant="destructive">
        <Info className="h-4 w-4" />
        <AlertTitle>Legal Disclaimer</AlertTitle>
        <AlertDescription>
          This tool does not diagnose diseases or medical conditions. It highlights lifestyle patterns associated with health risks. Always consult a healthcare professional for medical concerns. Your data is not saved or stored.
        </AlertDescription>
      </Alert>
    </div>
  );
}
