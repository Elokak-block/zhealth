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
    .describe('An array of the top 3 modifiable risk drivers identified from the user\'s answers.'),
});
export type GenerateRiskSignalExplanationsInput = z.infer<
  typeof GenerateRiskSignalExplanationsInputSchema
>;

const GenerateRiskSignalExplanationsOutputSchema = z.object({
  explanation: z.string().describe('Explanation of why the risk signal appeared, tailored to the signal type.'),
  suggestions: z.array(z.string()).describe('Three actionable, specific, and impactful suggestions for behavior modification based on the primary risk drivers.'),
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
  prompt: `You are an expert health analyst AI. Your task is to provide a non-diagnostic explanation and actionable advice for a specific lifestyle risk signal.

Analyze the provided data:
- Risk Signal: {{{riskSignal}}}
- Primary Risk Drivers: A list of the user's responses that contributed most to their score. These are the *most important* factors to address.
  - {{{primaryRiskDrivers}}}

Your response must be structured in JSON format.

1.  **Explanation:**
    - Write a concise, empathetic paragraph (2-3 sentences) explaining what the identified '{{{riskSignal}}}' means in simple terms.
    - **Crucially, tailor the explanation to the specific risk signal.**
      - For "Elevated Metabolic Risk Signals": Focus on blood sugar instability and metabolic strain.
      - For "Inflammatory Lifestyle Risk Signals Present": Focus on habits linked to long-term inflammation.
      - For "Cardiovascular Strain Indicators Detected": Focus on activity, fatigue, and recovery patterns suggesting heart strain.
      - For "Stress Load & Recovery Imbalance": Focus on hormonal imbalance from chronic stress and poor recovery.
      - For "High Systemic Lifestyle Strain": Explain that multiple areas are under pressure, making recovery difficult.
    - **Do NOT use medical jargon or diagnose any condition.** Frame it as "patterns" or "signals."

2.  **Suggestions:**
    - Provide exactly **three** highly specific, actionable, and impactful suggestions.
    - **Base these suggestions directly on the 'primaryRiskDrivers'.** Each suggestion should correspond to one of the drivers. For example, if a driver is "How often do you consume sugary drinks?", a suggestion could be "Swap one sugary drink per day with a glass of water or herbal tea."
    - The suggestions should be small, manageable changes the user can start *today*. They must be behavior-focused.

Example Input:
{
  "riskSignal": "Elevated Metabolic Risk Signals",
  "primaryRiskDrivers": [
    "How often do you consume sugary drinks (soda, sweetened juice, energy drinks)?",
    "How frequently do you eat ultra-processed foods (fast food, packaged snacks)?",
    "How often do you snack late at night?"
  ]
}

Example Output:
{
  "explanation": "Your responses show patterns commonly associated with blood sugar instability and metabolic strain. These signals are lifestyle-linked and modifiable, and addressing them can lead to more stable energy levels.",
  "suggestions": [
    "Replace one of your daily sugary drinks with sparkling water or unsweetened iced tea.",
    "Try swapping one ultra-processed snack this week for a piece of fruit or a handful of nuts.",
    "Aim to have your last snack at least two hours before you go to bed to give your body time to digest."
  ]
}
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
