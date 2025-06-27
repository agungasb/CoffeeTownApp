'use server';

import { db } from '@/lib/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, setDoc, Timestamp } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import type { Recipe } from '@/lib/recipes';
import type { ProductIngredients } from '@/lib/productIngredients';
import type { InventoryItem } from '@/lib/inventoryData';
import type { OcrProductionMappingOutput } from '@/ai/flows/ocr-production-mapping';
import { ocrProductionMapping } from '@/ai/flows/ocr-production-mapping';

const checkDb = () => {
    if (!db) {
        throw new Error("Database is not configured. Please check your Firebase credentials in .env.");
    }
}

// --- Recipe Actions ---
export async function addRecipe(recipe: Omit<Recipe, 'id'>) {
    checkDb();
    await addDoc(collection(db!, 'recipes'), recipe);
    revalidatePath('/');
}

export async function updateRecipe(recipe: Recipe) {
    checkDb();
    const { id, ...recipeData } = recipe;
    await updateDoc(doc(db!, 'recipes', id), recipeData);
    revalidatePath('/');
}

export async function deleteRecipe(recipeId: string) {
    checkDb();
    await deleteDoc(doc(db!, 'recipes', recipeId));
    revalidatePath('/');
}

// --- Product Actions ---
export async function updateProducts(products: ProductIngredients) {
    checkDb();
    await setDoc(doc(db!, 'appData', 'products'), { data: products });
    revalidatePath('/');
}

// --- Inventory Actions ---
export async function addInventoryItem(item: Omit<InventoryItem, 'id'>) {
    checkDb();
    await addDoc(collection(db!, 'inventory'), item);
    revalidatePath('/');
}

export async function updateInventoryItem(item: InventoryItem) {
    checkDb();
    const { id, ...itemData } = item;
    await updateDoc(doc(db!, 'inventory', id), itemData);
    revalidatePath('/');
}

export async function deleteInventoryItem(itemId: string) {
    checkDb();
    await deleteDoc(doc(db!, 'inventory', itemId));
    revalidatePath('/');
}

// --- Daily Usage Actions ---
export async function addDailyUsageRecord(record: { usage: { name: string, amount: number, unit: string }[] }) {
    checkDb();
    await addDoc(collection(db!, 'dailyUsage'), {
        date: Timestamp.now(),
        usage: record.usage,
    });
    revalidatePath('/');
}


// --- AI Actions ---
export async function getQuantitiesFromImage(photoDataUri: string): Promise<{ data: OcrProductionMappingOutput | null; error: string | null; }> {
    const MAX_RETRIES = 3;
    let lastError: Error | null = null;

    if (!photoDataUri) {
        return { data: null, error: "Image data URI is missing." };
    }

    for (let i = 0; i < MAX_RETRIES; i++) {
        try {
            const result = await ocrProductionMapping({ photoDataUri });
            return { data: result, error: null }; // Success
        } catch (error) {
            lastError = error instanceof Error ? error : new Error("An unknown error occurred.");
            console.error(`Attempt ${i + 1} failed for OCR mapping:`, lastError.message);

            // Check for overload error to retry
            if (lastError.message.includes("overloaded") && i < MAX_RETRIES - 1) {
                // Wait for a short, increasing amount of time before retrying
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
                console.log(`Retrying... (Attempt ${i + 2})`);
                continue; // Go to the next iteration to retry
            }
            
            // For other errors, or if it's the last retry, break the loop and return the error
            break;
        }
    }
    
    // If the loop finishes, it's because all retries failed or a non-retriable error occurred.
    const finalErrorMessage = lastError ? lastError.message : "An unknown error occurred.";
    return { data: null, error: `Failed to process image with AI: ${finalErrorMessage}` };
}
