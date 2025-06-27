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

// Define the prompt to ask the AI for a string output.
const prompt = ai.definePrompt({
  name: 'ocrProductionMappingPrompt',
  model: 'googleai/gemini-1.5-flash-latest',
  input: {schema: OcrProductionMappingInputSchema},
  // We are not specifying an output schema here, so the prompt will return a raw string.
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

  Analyze the photo and extract the quantities for each product, mapping them to the correct product name.  If a product's quantity cannot be determined, set it to 0. 

  Your response must be ONLY a raw JSON object string. Do not wrap it in markdown backticks (\`\`\`json) or add any other explanatory text. The JSON object should have keys that are the product names and values that are the corresponding quantities as numbers. Only include these products in the output, do not invent new products.

  Photo: {{media url=photoDataUri}}
  `,
});

// Define the flow to handle the logic.
const ocrProductionMappingFlow = ai.defineFlow(
  {
    name: 'ocrProductionMappingFlow',
    inputSchema: OcrProductionMappingInputSchema,
    outputSchema: OcrProductionMappingOutputSchema,
  },
  async input => {
    // Call the prompt. Since we didn't define an output schema, it returns a full GenerateResponse.
    const response = await prompt(input);
    
    // Get the raw text from the response.
    const textResponse = response.text;
    
    // Sometimes the model might still wrap the JSON in markdown, so we clean it.
    const cleanedText = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
        // Parse the cleaned text string into a JSON object.
        const parsedJson = JSON.parse(cleanedText);
        // Validate the parsed object against our output schema to ensure it's correct.
        return OcrProductionMappingOutputSchema.parse(parsedJson);
    } catch (error) {
        console.error("Failed to parse JSON from AI response:", cleanedText, error);
        // This gives the user a helpful error if the AI messes up the format.
        throw new Error("The AI returned an invalid data format. Please try again.");
    }
  }
);