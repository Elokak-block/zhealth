'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { questions } from '@/lib/questions';
import type { AnswerSet } from '@/lib/types';
import Header from '@/components/header';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Check } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import AdPlacement from '@/components/ad-placement';

const getInitialAnswers = (): AnswerSet => {
  return questions.reduce((acc, q) => {
    if (q.type === 'slider') {
      acc[q.id] = q.min !== undefined ? q.min + (q.max! - q.min!) / 2 : 5;
    }
    // Multiple choice is initially undefined until an option is selected.
    return acc;
  }, {} as AnswerSet);
};

export default function AssessmentPage() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerSet>(getInitialAnswers);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState(1); // 1 for next, -1 for back
  const [isLoading, setIsLoading] = useState(false);
  const [hasSliderInteracted, setHasSliderInteracted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / questions.length) * 100;

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setDirection(1);
      setIsTransitioning(true);
    } else {
      setIsLoading(true);
      const data = btoa(JSON.stringify(answers));
      router.push(`/results?data=${data}`);
    }
  };

 const handleAnswerChange = (questionId: string, value: number) => {
    setAnswers(prevAnswers => ({ ...prevAnswers, [questionId]: value }));
    if (currentQuestion.type === 'slider') {
      setHasSliderInteracted(true);
    }
  };
  
  const isCurrentAnswered = useMemo(() => {
    const currentAnswer = answers[currentQuestion.id];
    if (currentQuestion.type === 'slider') {
      return hasSliderInteracted;
    }
    return currentAnswer !== undefined;
  }, [answers, currentQuestion, hasSliderInteracted]);
  
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setDirection(-1);
      setIsTransitioning(true);
    } else {
      router.push('/');
    }
  };

  useEffect(() => {
    if (!isTransitioning) return;
    const timer = setTimeout(() => {
      if (direction === 1) {
        setCurrentQuestionIndex(i => i + 1);
      } else {
        setCurrentQuestionIndex(i => i - 1);
      }
      setHasSliderInteracted(false); // Reset slider interaction state
      setIsTransitioning(false);
    }, 150);
    return () => clearTimeout(timer);
  }, [isTransitioning, direction]);

  useEffect(() => {
    // Prefetch the results page to make the transition faster
    router.prefetch('/results');
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center text-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-semibold mb-2">Analyzing lifestyle patterns...</h2>
          <p className="text-muted-foreground">This will just take a moment.</p>
        </motion.div>
      </div>
    )
  }

  const adPlacements = currentQuestionIndex < 15 ? [102] : [103];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
       <div className="flex justify-center py-2">
         {currentQuestionIndex < 15 && <AdPlacement placementId={102} />}
         {currentQuestionIndex >= 15 && <AdPlacement placementId={103} />}
      </div>
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-2xl space-y-4">
           <div>
            <Progress value={progress} className="w-full h-1" />
            <p className="text-sm text-center text-muted-foreground mt-2">
              {currentQuestionIndex + 1} of {questions.length}
              {currentQuestionIndex > questions.length - 5 && ' - Almost there!'}
            </p>
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentQuestionIndex}
              custom={direction}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden: (direction) => ({ opacity: 0, x: direction * 30 }),
                visible: { opacity: 1, x: 0 },
                exit: (direction) => ({ opacity: 0, x: direction * -30 }),
              }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <Card className="shadow-2xl bg-card/50 backdrop-blur-sm border border-white/5">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl font-semibold text-center leading-tight">
                    {currentQuestion.text}
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-8 px-4 sm:px-10">
                  <div className="flex justify-center">
                    <div className="w-full max-w-md">
                     {currentQuestion.type === 'slider' && (
                        <div className="space-y-4">
                          <Slider
                            id={currentQuestion.id}
                            min={currentQuestion.min}
                            max={currentQuestion.max}
                            step={currentQuestion.step}
                            value={[answers[currentQuestion.id] ?? 5]}
                            onValueChange={([value]) => handleAnswerChange(currentQuestion.id, value)}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground px-1">
                            <span>{currentQuestion.minLabel}</span>
                            <span>{currentQuestion.maxLabel}</span>
                          </div>
                        </div>
                      )}
                      {currentQuestion.type === 'multiple-choice' && (
                        <RadioGroup
                          id={currentQuestion.id}
                          value={answers[currentQuestion.id]?.toString()}
                          onValueChange={(value) => handleAnswerChange(currentQuestion.id, parseInt(value, 10))}
                          className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3"
                        >
                          {currentQuestion.options?.map((option) => (
                            <Label
                              key={option.value}
                              className="relative flex items-center justify-center text-center space-x-3 p-3 text-sm border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 has-[input:checked]:bg-primary/90 has-[input:checked]:text-primary-foreground has-[input:checked]:border-primary"
                            >
                              <RadioGroupItem value={option.value.toString()} className="sr-only"/>
                              <span>{option.label}</span>
                               {answers[currentQuestion.id] === option.value && (
                                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary/80">
                                  <Check className="h-3 w-3 text-primary-foreground" />
                                </span>
                              )}
                            </Label>
                          ))}
                        </RadioGroup>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="ghost" onClick={handleBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button onClick={handleNext} disabled={!isCurrentAnswered}>
                    {currentQuestionIndex === questions.length - 1 ? 'See My Results' : 'Next'}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
