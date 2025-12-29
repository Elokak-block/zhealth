
'use client';

import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toPng } from 'html-to-image';
import Image from 'next/image';
import { calculateScores } from '@/lib/scoring';
import type { AnswerSet, ResultData, PillarId } from '@/lib/types';
import { PILLARS } from '@/lib/types';
import AdPlacement from '@/components/ad-placement';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Info, AlertTriangle, Brain, Zap, Shield, Apple, Dumbbell, Bed, Activity, Share2, Copy, MessageCircle } from 'lucide-react';
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

function ResultsClientInternal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dataParam = searchParams.get('data');
  const shareableRef = useRef<HTMLDivElement>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, after hydration
    const url = window.location.href;
    setQrCodeUrl(url);
  }, []);

  const resultData: ResultData | null = useMemo(() => {
    if (!dataParam) return null;
    try {
      const answers: AnswerSet = JSON.parse(atob(dataParam));
      return calculateScores(answers);
    } catch (error) {
      console.error('Failed to parse result data:', error);
      return null;
    }
  }, [dataParam]);

  const handleDownloadImage = useCallback(() => {
    if (shareableRef.current === null) return;
    toPng(shareableRef.current, {
      cacheBust: true,
      backgroundColor: '#0F1115',
      pixelRatio: 2, // Increase resolution
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'zutyhealth-results.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => console.error(err));
  }, []);

  const handleCopyLink = () => {
    if (!qrCodeUrl) return;
    navigator.clipboard.writeText(qrCodeUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const shareOnX = () => {
    const text = `I just checked my Lifestyle Strain Index on Zuty Health and my score is ${resultData?.lifestyleStrainIndex} (${resultData?.tier.name})! Find out yours:`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(qrCodeUrl)}`;
    window.open(url, '_blank');
  };

  const shareOnWhatsApp = () => {
    const text = `I just checked my Lifestyle Strain Index on Zuty Health and my score is ${resultData?.lifestyleStrainIndex} (${resultData?.tier.name})! Find out yours: ${qrCodeUrl}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };
  
  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(qrCodeUrl)}`;
    window.open(url, '_blank');
  };

  if (!dataParam) {
     return (
      <div className="flex flex-col min-h-screen items-center justify-center text-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold mb-2">Loading results...</h2>
          <p className="text-muted-foreground">Or the data is invalid. Please try again.</p>
           <Button onClick={() => router.push('/assessment')} className="mt-4">Try Again</Button>
        </motion.div>
      </div>
    );
  }

  if (!resultData) {
    return (
      <div className="container mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Could not load results.</h2>
        <p className="mb-4 text-muted-foreground">The data may be invalid. Please try the assessment again.</p>
        <Button onClick={() => router.push('/assessment')}>Try Again</Button>
      </div>
    );
  }

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
      
      <div className="flex justify-center">
        <AdPlacement placementId={104} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle>Pillar Breakdown</CardTitle>
              <CardDescription>Your score across different areas of your life.</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                {Object.keys(resultData.pillarScores).map((pillar) => {
                  const p = pillar as PillarId;
                  return (
                    <div key={p}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-muted-foreground">{PILLARS[p].name}</span>
                        <span className="text-sm font-bold">{resultData.pillarScores[p]} / {PILLARS[p].maxScore}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div
                          className="h-2.5 rounded-full transition-all duration-500 ease-out"
                          style={{
                            width: `${(resultData.pillarScores[p] / PILLARS[p].maxScore) * 100}%`,
                            backgroundColor: getScoreColor(100 - (resultData.pillarScores[p] / PILLARS[p].maxScore) * 100),
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {resultData.riskFlags.length > 0 && (
            <>
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
            <div className="flex justify-center">
                <AdPlacement placementId={105} />
            </div>
            </>
          )}
        </div>

        <div className="space-y-6 md:space-y-8">
           <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Share2 /> Share Your Results</CardTitle>
              <CardDescription>Share your results with friends and family.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
               <Button onClick={handleCopyLink} className="w-full">
                <Copy className="mr-2 h-4 w-4" />
                {isCopied ? 'Link Copied!' : 'Copy Link'}
              </Button>
              <div className="flex w-full justify-center gap-2">
                <Button variant="outline" size="icon" onClick={shareOnX} aria-label="Share on X">
                   <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current"><title>X</title><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
                </Button>
                <Button variant="outline" size="icon" onClick={shareOnWhatsApp} aria-label="Share on WhatsApp">
                   <Image src="/whatsapp.png" alt="WhatsApp" width={20} height={20} className="filter grayscale brightness-200" />
                </Button>
                 <Button variant="outline" size="icon" onClick={shareOnFacebook} aria-label="Share on Facebook">
                   <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current"><title>Facebook</title><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle>Download Result Image</CardTitle>
              <CardDescription>Download a summary image of your results.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <div ref={shareableRef} className="p-6 bg-background rounded-lg w-full aspect-square flex flex-col" style={{ backgroundColor: '#0F1115' }}>
                <div className="flex-1 flex flex-col justify-center items-center text-center">
                    <h3 className="text-lg font-bold text-primary">Zuty Health</h3>
                    <p className="text-sm text-muted-foreground -mt-1">My Lifestyle Strain Index</p>
                    <p className="text-8xl font-bold my-2" style={{ color: scoreColorClass }}>{resultData.lifestyleStrainIndex}</p>
                    <p className="text-2xl font-semibold">{resultData.tier.name}</p>
                </div>
                <div className="grid grid-cols-3 gap-x-4 gap-y-2 text-xs mb-4">
                    {Object.keys(resultData.pillarScores).slice(0, 6).map(pillar => {
                        const p = pillar as PillarId;
                        return(
                            <div key={p} className="flex flex-col items-center text-center">
                                <span className="font-semibold">{PILLARS[p].name.split(' ')[0]}</span>
                                <span className="text-muted-foreground">{resultData.pillarScores[p]}/{PILLARS[p].maxScore}</span>
                            </div>
                        )
                    })}
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold">Check your score at zutyhealth.com</p>
                  <p className="text-[10px] text-muted-foreground/80 mt-1">This is not medical advice. Consult a doctor for health concerns.</p>
                </div>
              </div>
              <Button onClick={handleDownloadImage} className="w-full"><Download className="mr-2" /> Download Image</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Alert variant="default" className="bg-card/30 border-accent/50">
        <Info className="h-4 w-4 text-accent" />
        <AlertTitle className="text-foreground">Legal Disclaimer</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          This tool does not diagnose diseases or medical conditions. It highlights lifestyle patterns associated with health risks. Always consult a healthcare professional for medical concerns. Your data is not saved or stored.
        </AlertDescription>
      </Alert>
    </motion.div>
  );
}


export default function ResultsClientWrapper() {
  return <ResultsClientInternal />;
}
