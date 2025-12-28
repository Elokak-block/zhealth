'use server';
/**
 * @fileOverview Generates explanations for risk signal flags and suggests actionable behavior modifications.
 *
 * - generateRiskSignalExplanations - A function that generates explanations for risk signal flags.
 * - GenerateRiskSignalExplanationsInput - The input type for the generateRiskSignalExplanations function.
 * - GenerateRiskSignalExplanationsOutput - The return type for the generateRiskSignalExplanations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRiskSignalExplanationsInputSchema = z.object({
  riskSignal: z.string().describe('The identified risk signal flag.'),
  pillarBreakdown: z
    .record(z.number())
    .describe(
      'A record containing the breakdown of scores for each health pillar. Keys are pillar names, values are scores.'
    ),
  primaryRiskDrivers: z
    .array(z.string())
    .describe('An array of the top risk drivers identified.'),
});
export type GenerateRiskSignalExplanationsInput = z.infer<
  typeof GenerateRiskSignalExplanationsInputSchema
>;

const GenerateRiskSignalExplanationsOutputSchema = z.object({
  explanation: z.string().describe('Explanation of why the risk signal appeared.'),
  suggestions: z.array(z.string()).describe('Actionable suggestions for behavior modification.'),
});
export type GenerateRiskSignalExplanationsOutput = z.infer<
  typeof GenerateRiskSignalExplanationsOutputSchema
>;

export async function generateRiskSignalExplanations(
  input: GenerateRiskSignalExplanationsInput
): Promise<GenerateRiskSignalExplanationsOutput> {
  return generateRiskSignalExplanationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRiskSignalExplanationsPrompt',
  input: {schema: GenerateRiskSignalExplanationsInputSchema},
  output: {schema: GenerateRiskSignalExplanationsOutputSchema},
  prompt: `You are an AI assistant designed to explain health risk signals and suggest actionable behavior changes.

  Based on the identified risk signal, pillar breakdown, and primary risk drivers, provide a clear explanation of why the risk signal appeared and suggest actionable steps the user can take to modify their behavior.

  Risk Signal: {{{riskSignal}}}
Pillar Breakdown: {{{pillarBreakdown}}}
Primary Risk Drivers: {{{primaryRiskDrivers}}}

  Explanation:
  Suggestions:
  `,
});

const generateRiskSignalExplanationsFlow = ai.defineFlow(
  {
    name: 'generateRiskSignalExplanationsFlow',
    inputSchema: GenerateRiskSignalExplanationsInputSchema,
    outputSchema: GenerateRiskSignalExplanationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
