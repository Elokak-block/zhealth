'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { questions } from '@/lib/questions';
import type { AnswerSet, Question } from '@/lib/types';
import Header from '@/components/header';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft } from 'lucide-react';

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

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerChange = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };
  
  const isCurrentAnswered = useMemo(() => {
    const currentAnswer = answers[currentQuestion.id];
    return currentAnswer !== undefined;
  }, [answers, currentQuestion]);

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Encode answers and navigate to results
      const data = btoa(JSON.stringify(answers));
      router.push(`/results?data=${data}`);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-2xl">
          <div className="mb-4">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-center text-muted-foreground mt-2">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>
          <Card className="shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-headline text-center">
                {currentQuestion.text}
              </CardTitle>
              <CardDescription className="text-center">
                Your answer helps us understand your lifestyle patterns.
              </CardDescription>
            </CardHeader>
            <CardContent className="py-8 px-6 sm:px-10">
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
                      <div className="flex justify-between text-xs text-muted-foreground">
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
                      className="space-y-3"
                    >
                      {currentQuestion.options?.map((option) => (
                        <Label
                          key={option.value}
                          className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 has-[input:checked]:bg-primary/10 has-[input:checked]:border-primary"
                        >
                          <RadioGroupItem value={option.value.toString()} />
                          <span>{option.label}</span>
                        </Label>
                      ))}
                    </RadioGroup>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleNext} disabled={!isCurrentAnswered}>
                {currentQuestionIndex === questions.length - 1 ? 'See My Results' : 'Next'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
