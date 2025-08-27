'use server';
/**
 * @fileOverview Generates an image from a Telegram user's text prompt.
 *
 * - generateImage - A function that handles the image generation process.
 * - GenerateImageInput - The input type for the generateImage function.
 * - GenerateImageOutput - The return type for the generateImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImageInputSchema = z.object({
  prompt: z.string().describe('The text prompt from the Telegram user.'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

const GenerateImageOutputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      'The generated image as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
  return generateImageFlow(input);
}

const generateImagePrompt = ai.definePrompt({
  name: 'generateImagePrompt',
  input: {schema: GenerateImageInputSchema},
  output: {schema: GenerateImageOutputSchema},
  prompt: 'Generate an image based on the following prompt: {{{prompt}}}',
});

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      prompt: input.prompt,
      model: 'googleai/imagen-4.0-fast-generate-001',
    });

    if (!media) {
      throw new Error('Failed to generate image.');
    }

    return {imageDataUri: media.url!};
  }
);
