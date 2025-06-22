
'use server';

import { ocrProductionMapping } from "@/ai/flows/ocr-production-mapping";
import type { OcrProductionMappingOutput } from "@/ai/flows/ocr-production-mapping";

export async function getQuantitiesFromImage(photoDataUri: string): Promise<{ data: OcrProductionMappingOutput | null; error: string | null; }> {
  try {
    if (!photoDataUri) {
      throw new Error("Image data URI is missing.");
    }
    const result = await ocrProductionMapping({ photoDataUri });
    return { data: result, error: null };
  } catch (error) {
    console.error("Error in OCR mapping:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { data: null, error: `Failed to process image with AI: ${errorMessage}` };
  }
}
