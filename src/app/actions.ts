'use server';

import { db } from '@/lib/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, setDoc, Timestamp } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import type { Recipe } from '@/lib/recipes';
import type { ProductIngredients } from '@/lib/productIngredients';
import type { InventoryItem } from '@/lib/inventoryData';
import type { OcrProductionMappingOutput } from '@/ai/flows/ocr-production-mapping';
import { ocrProductionMapping } from '@/ai/flows/ocr-production-mapping';

// --- Recipe Actions ---
export async function addRecipe(recipe: Omit<Recipe, 'id'>) {
    await addDoc(collection(db, 'recipes'), recipe);
    revalidatePath('/');
}

export async function updateRecipe(recipe: Recipe) {
    const { id, ...recipeData } = recipe;
    await updateDoc(doc(db, 'recipes', id), recipeData);
    revalidatePath('/');
}

export async function deleteRecipe(recipeId: string) {
    await deleteDoc(doc(db, 'recipes', recipeId));
    revalidatePath('/');
}

// --- Product Actions ---
export async function updateProducts(products: ProductIngredients) {
    await setDoc(doc(db, 'appData', 'products'), { data: products });
    revalidatePath('/');
}

// --- Inventory Actions ---
export async function addInventoryItem(item: Omit<InventoryItem, 'id'>) {
    await addDoc(collection(db, 'inventory'), item);
    revalidatePath('/');
}

export async function updateInventoryItem(item: InventoryItem) {
    const { id, ...itemData } = item;
    await updateDoc(doc(db, 'inventory', id), itemData);
    revalidatePath('/');
}

export async function deleteInventoryItem(itemId: string) {
    await deleteDoc(doc(db, 'inventory', itemId));
    revalidatePath('/');
}

// --- Daily Usage Actions ---
export async function addDailyUsageRecord(record: { usage: [string, number, string][] }) {
    await addDoc(collection(db, 'dailyUsage'), {
        date: Timestamp.now(),
        usage: record.usage,
    });
    revalidatePath('/');
}


// --- AI Actions ---
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
