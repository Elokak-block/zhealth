import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function FaqPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-3xl">
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="text-3xl font-semibold">
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    What is the Lifestyle Strain Assessment?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-2">
                    <p>
                      It is a non-diagnostic wellness tool that analyzes your
                      self-reported daily habits to calculate a Lifestyle Strain
                      Index (LSI). This score offers insight into how your
                      lifestyle patterns—related to diet, sleep, and stress—may
                      impact your long-term wellness.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Is this a medical diagnosis?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-2">
                    <p className="font-semibold text-accent">
                      No. This tool is not a substitute for professional
                      medical advice.
                    </p>
                    <p>
                      All results, scores, and risk indicators are for informational
                      purposes only. They are designed to promote awareness of
                      lifestyle patterns, not to diagnose, treat, or prevent
                      any disease. Always consult a healthcare professional for
                      medical concerns.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>How does the scoring work?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-2">
                    <p>
                      The scoring system is based on a weighted model where
                      answers to questions are assigned a numeric value.
                      Questions are grouped into seven pillars (e.g., Diet,
                      Sleep, Stress).
                    </p>
                    <p>
                      Pillars with a higher potential impact on health, like
                      Substance Use and Medical History, carry more weight. A
                      higher final score indicates healthier lifestyle habits,
                      while a lower score suggests higher lifestyle strain.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>How is my data used and is it private?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-2">
                    <p>
                      We do not save, store, or track your personal answers or
                      results. All calculations are performed in your browser.
                      Your privacy is a top priority. Once you leave the results
                      page, the data is gone.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-5">
                  <AccordionTrigger>What are health risk indicators?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-2">
                    <p>
                      Health risk indicators are flags generated when your
                      answers in a specific category fall below a certain
                      threshold. For example, a low score in the "Sleep" pillar
                      might trigger a "Sleep Strain" flag.
                    </p>
                     <p>
                      These are not predictions but simply highlight areas
                      where your lifestyle patterns may be contributing to
                      higher strain. They are intended to help you focus your
                      efforts on specific habit improvements.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-6">
                  <AccordionTrigger>Who is this wellness insight tool for?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-2">
                    <p>
                      This tool is for anyone interested in gaining a better
                      understanding of how their daily habits and lifestyle
                      patterns are shaping their overall wellness. It is designed
                      for self-reflection and educational purposes, helping you
                      connect the dots between your choices and your well-being.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
