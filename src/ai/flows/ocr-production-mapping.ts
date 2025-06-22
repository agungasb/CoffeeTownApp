'use server';

/**
 * @fileOverview Extracts production quantities from an image using OCR and maps them to product fields.
 *
 * - ocrProductionMapping - A function that handles the OCR and data mapping process.
 * - OcrProductionMappingInput - The input type for the ocrProductionMapping function, which includes an image data URI.
 * - OcrProductionMappingOutput - The return type for the ocrProductionMapping function, which is a map of product names to quantities.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OcrProductionMappingInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a production sheet, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type OcrProductionMappingInput = z.infer<typeof OcrProductionMappingInputSchema>;

const OcrProductionMappingOutputSchema = z.record(z.string(), z.number()).describe('A map of product names to quantities.');
export type OcrProductionMappingOutput = z.infer<typeof OcrProductionMappingOutputSchema>;

export async function ocrProductionMapping(input: OcrProductionMappingInput): Promise<OcrProductionMappingOutput> {
  return ocrProductionMappingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'ocrProductionMappingPrompt',
  input: {schema: OcrProductionMappingInputSchema},
  output: {schema: OcrProductionMappingOutputSchema},
  prompt: `You are an expert bakery production manager. You will extract the production quantities for various bakery items from a photo and map them to the corresponding product names.  The photo is provided as a data URI.

  Here are the products:
  - abon ayam pedas
  - abon piramid
  - abon roll pedas
  - abon sosis
  - cheese roll
  - cream choco cheese
  - donut paha ayam
  - double coklat
  - hot sosis
  - kacang merah
  - maxicana coklat
  - red velvet cream cheese
  - sosis label
  - strawberry almond
  - vanilla oreo
  - abon taiwan

  Analyze the photo and extract the quantities for each product, mapping them to the correct product name.  If a product's quantity cannot be determined, set it to 0. Return a JSON object where the keys are the product names and the values are the corresponding quantities as numbers. Only include these products in the output, do not invent new products.

  Photo: {{media url=photoDataUri}}
  `,
});

const ocrProductionMappingFlow = ai.defineFlow(
  {
    name: 'ocrProductionMappingFlow',
    inputSchema: OcrProductionMappingInputSchema,
    outputSchema: OcrProductionMappingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
