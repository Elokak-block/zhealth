'use client';

import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toPng } from 'html-to-image';
import QRCode from 'qrcode.react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip, Cell } from 'recharts';
import { calculateScores } from '@/lib/scoring';
import type { AnswerSet, ResultData, PillarId } from '@/lib/types';
import { PILLARS } from '@/lib/types';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Info, AlertTriangle, HeartPulse, Brain, Zap, Shield, Apple, Dumbbell, Bed, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const pillarIcons: Record<PillarId, React.ReactNode> = {
  diet: <Apple />,
  activity: <Dumbbell />,
  sleep: <Bed />,
  stress: <Brain />,
  habits: <Zap />,
  medical: <Shield />,
  lifestyle: <Activity />,
};

function ResultsClientInternal({ data }: { data?: string }) {
  const router = useRouter();
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
        link.download = 'zutyhealth-results.png';
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
    name: PILLARS[pillar as PillarId].name,
    score: resultData.pillarScores[pillar as PillarId],
    maxScore: PILLARS[pillar as PillarId].maxScore,
  }));

  const getScoreColor = (strainIndex: number) => {
    if (strainIndex <= 20) return 'hsl(var(--chart-3))'; // Excellent - Green
    if (strainIndex <= 31) return 'hsl(var(--chart-2))'; // Moderate - Yellow
    if (strainIndex <= 50) return 'hsl(var(--accent))';   // Elevated - Amber
    if (strainIndex <= 69) return 'hsl(var(--destructive))'; // High - Red
    return 'hsl(var(--destructive))'; // Very High - Red
  };
  
  const scoreColorClass = useMemo(() => getScoreColor(resultData.lifestyleStrainIndex), [resultData.lifestyleStrainIndex]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-5xl mx-auto p-4 md:p-6 space-y-6 md:space-y-8"
    >
      {/* Main Score */}
      <Card className="text-center shadow-lg bg-card/50">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg font-medium text-muted-foreground">Lifestyle Strain Index</CardTitle>
          <p className="text-7xl sm:text-8xl font-bold" style={{ color: scoreColorClass }}>{resultData.lifestyleStrainIndex}</p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <p className="text-2xl sm:text-3xl font-semibold">{resultData.tier.name}</p>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto text-sm sm:text-base">{resultData.tier.description}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle>Pillar Breakdown</CardTitle>
              <CardDescription>Your score across different areas of your life.</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                {chartData.map((pillar) => (
                  <div key={pillar.name}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-muted-foreground">{pillar.name}</span>
                      <span className="text-sm font-bold">{pillar.score} / {pillar.maxScore}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full"
                        style={{
                          width: `${(pillar.score / pillar.maxScore) * 100}%`,
                          backgroundColor: getScoreColor(100 - (pillar.score / pillar.maxScore) * 100),
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {resultData.riskFlags.length > 0 && (
            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><AlertTriangle className="text-accent" /> Areas for Improvement</CardTitle>
                <CardDescription>Based on your answers, here are some areas to focus on.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {resultData.riskFlags.map((flag, index) => (
                  <div key={index} className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg">
                     <div className="text-primary">{pillarIcons[Object.keys(PILLARS).find(p => PILLARS[p as PillarId].name === flag.name) as PillarId]}</div>
                    <div>
                      <h4 className="font-semibold text-foreground">{flag.name}</h4>
                      <p className="text-sm text-muted-foreground">{flag.tip}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6 md:space-y-8">
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle>Share Your Summary</CardTitle>
              <CardDescription>Download a summary of your results.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <div ref={shareableRef} className="p-4 bg-background rounded-lg w-full aspect-[4/3] flex flex-col justify-between" style={{ backgroundColor: '#0F1115' }}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-primary">Zuty Health</h3>
                    <p className="text-xs text-muted-foreground">My Lifestyle Strain Index</p>
                    <p className="text-5xl font-bold" style={{ color: scoreColorClass }}>{resultData.lifestyleStrainIndex}</p>
                    <p className="text-lg font-semibold">{resultData.tier.name}</p>
                  </div>
                  <QRCode value={typeof window !== 'undefined' ? window.location.href : ''} size={50} level="L" bgColor="transparent" fgColor="hsl(var(--foreground))" />
                </div>
                <p className="text-[10px] text-muted-foreground">This is not medical advice. Consult a doctor for health concerns. Results from zutyhealth.com</p>
              </div>
              <Button onClick={handleDownloadImage} className="w-full"><Download className="mr-2" /> Download Image</Button>
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
  const searchParams = useSearchParams();
  const dataParam = data || searchParams.get('data');

  if (!dataParam) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center text-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold mb-2">Loading results...</h2>
        </motion.div>
      </div>
    );
  }

  return <ResultsClientInternal data={dataParam || undefined} />;
}
