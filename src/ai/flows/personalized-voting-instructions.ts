'use server';

/**
 * @fileOverview Personalized voting instructions flow.
 *
 * - personalizedVotingInstructions - A function that returns personalized voting instructions.
 * - PersonalizedVotingInstructionsInput - The input type for the personalizedVotingInstructions function.
 * - PersonalizedVotingInstructionsOutput - The return type for the personalizedVotingInstructions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedVotingInstructionsInputSchema = z.object({
  age: z.number().describe('The age of the voter.'),
  location: z.string().describe('The location of the voter.'),
});
export type PersonalizedVotingInstructionsInput = z.infer<typeof PersonalizedVotingInstructionsInputSchema>;

const PersonalizedVotingInstructionsOutputSchema = z.object({
  instructions: z.string().describe('Personalized voting instructions.'),
});
export type PersonalizedVotingInstructionsOutput = z.infer<typeof PersonalizedVotingInstructionsOutputSchema>;

export async function personalizedVotingInstructions(
  input: PersonalizedVotingInstructionsInput
): Promise<PersonalizedVotingInstructionsOutput> {
  return personalizedVotingInstructionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedVotingInstructionsPrompt',
  input: {schema: PersonalizedVotingInstructionsInputSchema},
  output: {schema: PersonalizedVotingInstructionsOutputSchema},
  prompt: `You are an AI assistant designed to provide personalized voting instructions for first-time voters in India.

  Provide clear, step-by-step instructions on how to vote, including eligibility criteria and necessary documentation, tailored to the voter's age and location.

  Voter Age: {{{age}}}
Voter Location: {{{location}}}

  Instructions:`,
});

const personalizedVotingInstructionsFlow = ai.defineFlow(
  {
    name: 'personalizedVotingInstructionsFlow',
    inputSchema: PersonalizedVotingInstructionsInputSchema,
    outputSchema: PersonalizedVotingInstructionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
