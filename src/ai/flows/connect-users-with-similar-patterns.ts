'use server';
/**
 * @fileOverview A flow that connects users with similar lifestyle patterns for private discussions and resource sharing.
 *
 * - connectUsersWithSimilarPatterns - A function that connects users with similar patterns.
 * - ConnectUsersWithSimilarPatternsInput - The input type for the connectUsersWithSimilarPatterns function.
 * - ConnectUsersWithSimilarPatternsOutput - The return type for the connectUsersWithSimilarPatterns function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ConnectUsersWithSimilarPatternsInputSchema = z.object({
  lifestyleStrainIndex: z
    .number()
    .describe('The lifestyle strain index of the user (0-100).'),
  riskAlignmentFlags: z
    .array(z.string())
    .describe('The risk alignment flags generated for the user.'),
  pillarBreakdown: z
    .record(z.number())
    .describe(
      'A record of the pillar breakdown, with pillar names as keys and scores as values.'
    ),
});
export type ConnectUsersWithSimilarPatternsInput = z.infer<
  typeof ConnectUsersWithSimilarPatternsInputSchema
>;

const ConnectUsersWithSimilarPatternsOutputSchema = z.object({
  communityTopicSuggestion: z
    .string()
    .describe(
      'A suggested community topic or discussion prompt based on the user lifestyle patterns.'
    ),
  suggestedResources: z
    .array(z.string())
    .describe(
      'A list of suggested resources or support groups that may be relevant to the user.'
    ),
});
export type ConnectUsersWithSimilarPatternsOutput = z.infer<
  typeof ConnectUsersWithSimilarPatternsOutputSchema
>;

export async function connectUsersWithSimilarPatterns(
  input: ConnectUsersWithSimilarPatternsInput
): Promise<ConnectUsersWithSimilarPatternsOutput> {
  return connectUsersWithSimilarPatternsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'connectUsersWithSimilarPatternsPrompt',
  input: {schema: ConnectUsersWithSimilarPatternsInputSchema},
  output: {schema: ConnectUsersWithSimilarPatternsOutputSchema},
  prompt: `You are a community facilitator specializing in connecting people with similar lifestyle patterns and health risk indicators.

  Based on the user's lifestyle strain index, risk alignment flags, and pillar breakdown, suggest a community topic or discussion prompt that would be relevant to them.
  Also, suggest a list of resources or support groups that may be helpful to the user.

  Lifestyle Strain Index: {{{lifestyleStrainIndex}}}
  Risk Alignment Flags: {{#each riskAlignmentFlags}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Pillar Breakdown: {{#each pillarBreakdown}}{{{@key}}}: {{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Here's an example of output that should be returned:
  ```json
  {
    "communityTopicSuggestion": "Discussing strategies for managing stress and improving sleep quality.",
    "suggestedResources": ["Mindfulness and Meditation Apps", "Local Stress Management Workshops", "Online Sleep Improvement Programs"]
  }
  ```
  `,
});

const connectUsersWithSimilarPatternsFlow = ai.defineFlow(
  {
    name: 'connectUsersWithSimilarPatternsFlow',
    inputSchema: ConnectUsersWithSimilarPatternsInputSchema,
    outputSchema: ConnectUsersWithSimilarPatternsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
