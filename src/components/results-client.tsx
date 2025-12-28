'use client';

import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toPng } from 'html-to-image';
import QRCode from 'qrcode.react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip, Cell } from 'recharts';
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
import { Download, Info, MessageSquare, Users, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

type RiskExplanation = { title: string; explanation: string; suggestions: string[] };
type CommunitySuggestion = { communityTopicSuggestion: string; suggestedResources: string[] };

function ResultsClientInternal({ data }: { data?: string }) {
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
    toPng(shareableRef.current, { 
        cacheBust: true,
        backgroundColor: '#0F1115',
        width: 400,
        height: 300,
     })
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
        <p className="mb-4 text-muted-foreground">The data may be invalid. Please try the assessment again.</p>
        <Button onClick={() => router.push('/assessment')}>Try Again</Button>
      </div>
    );
  }

  const chartData = Object.keys(resultData.pillarScores).map((pillar) => ({
    name: PILLARS[pillar as PillarId].name.split(' & ')[0],
    score: resultData.pillarScores[pillar as PillarId],
  }));

  const getScoreColor = (score: number) => {
    if (score <= 35) return 'hsl(var(--chart-3))'; // Muted Sage Green
    if (score <= 70) return 'hsl(var(--chart-2))'; // Subtle Amber
    return 'hsl(var(--accent))'; // Slightly more intense Amber/Orange for high strain
  };

  const scoreColorClass = useMemo(() => getScoreColor(resultData.lifestyleStrainIndex), [resultData.lifestyleStrainIndex]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-5xl mx-auto p-4 md:p-6 space-y-8"
    >
      {/* Main Score */}
      <Card className="text-center shadow-lg bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-muted-foreground">Lifestyle Strain Index</CardTitle>
          <p className="text-8xl font-bold" style={{color: scoreColorClass}}>{resultData.lifestyleStrainIndex}</p>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">{resultData.tier.name}</p>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">{resultData.tier.description}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle>Pillar Breakdown</CardTitle>
              <CardDescription>Your score across different areas of your life.</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 20, top: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis dataKey="name" type="category" width={110} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <RechartsTooltip cursor={{ fill: 'hsl(var(--muted) / 0.3)' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }} />
                  <Bar dataKey="score" barSize={20} radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={getScoreColor(entry.score)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {resultData.riskFlags.length > 0 && (
            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><AlertTriangle className="text-accent" /> Risk Signals</CardTitle>
                <CardDescription>Based on your answers, here are some lifestyle patterns we observed.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingAI ? (
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : riskExplanations.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                    {riskExplanations.map((item, index) => (
                      <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger className="font-semibold text-left text-base">{item.title}</AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-2">
                          <p className="text-muted-foreground">{item.explanation}</p>
                          <h4 className="font-semibold text-foreground">Primary Drivers & Actionable Steps:</h4>
                          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
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
          )}
        </div>

        <div className="space-y-8">
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Users/> Community Connection</CardTitle>
              <CardDescription>Connect with others on a similar path.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingAI ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ) : communitySuggestion ? (
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-semibold flex items-center gap-2 text-sm"><MessageSquare size={16}/> Suggested Topic</h4>
                    <p className="text-sm text-muted-foreground mt-1">{communitySuggestion.communityTopicSuggestion}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Helpful Resources:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground mt-2">
                       {communitySuggestion.suggestedResources.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                </div>
              ) : <p className="text-muted-foreground text-sm">Could not load community suggestions at this time.</p>}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Join the Conversation</Button>
            </CardFooter>
          </Card>
          
           <Card className="bg-card/50">
            <CardHeader>
              <CardTitle>Share Your Summary</CardTitle>
              <CardDescription>Download a summary of your results.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <div ref={shareableRef} className="p-6 bg-background rounded-lg w-full aspect-[4/3] flex flex-col justify-between" style={{ backgroundColor: '#0F1115' }}>
                 <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-bold text-primary">Vitality Compass</h3>
                        <p className="text-sm text-muted-foreground">My Lifestyle Strain Index</p>
                        <p className="text-6xl font-bold" style={{color: scoreColorClass}}>{resultData.lifestyleStrainIndex}</p>
                        <p className="text-xl font-semibold">{resultData.tier.name}</p>
                    </div>
                    <QRCode value={typeof window !== 'undefined' ? window.location.href : ''} size={60} level="L" bgColor="transparent" fgColor="hsl(var(--foreground))" />
                 </div>
                 <p className="text-[10px] text-muted-foreground">This is not medical advice. Consult a doctor for health concerns. Results from vitality-compass.app</p>
              </div>
              <Button onClick={handleDownloadImage} className="w-full"><Download className="mr-2"/> Download Image</Button>
            </CardContent>
          </Card>

        </div>
      </div>

      <Alert variant="default" className="bg-card/30 border-accent/50 text-accent-foreground">
        <Info className="h-4 w-4 text-accent" />
        <AlertTitle>Legal Disclaimer</AlertTitle>
        <AlertDescription>
          This tool does not diagnose diseases or medical conditions. It highlights lifestyle patterns associated with health risks. Always consult a healthcare professional for medical concerns. Your data is not saved or stored.
        </AlertDescription>
      </Alert>
    </motion.div>
  );
}


export default function ResultsClientWrapper({ data }: { data?: string }) {
  // This wrapper ensures suspense boundary is respected
  return <ResultsClientInternal data={data} />;
}
