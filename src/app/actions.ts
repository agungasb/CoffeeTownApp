
'use server';

import { db } from '@/lib/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, setDoc, Timestamp, writeBatch, getDocs, getDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import type { Recipe } from '@/lib/recipes';
import type { AllProductsData, ProductData, IngredientData } from '@/lib/productIngredients';
import type { InventoryItem } from '@/lib/inventoryData';
import type { DailyUsageRecord, DailyUsageIngredient } from '@/components/bakery-app';
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
export async function updateProducts(products: AllProductsData) {
    checkDb();
    const productsDocRef = doc(db!, 'appData', 'products');
    await setDoc(productsDocRef, { data: products });
    revalidatePath('/');
}


// --- Inventory Actions ---
export async function addInventoryItem(item: Omit<InventoryItem, 'id'>) {
    checkDb();
    await addDoc(collection(db!, 'inventory'), item);
    revalidatePath('/');
}

export async function updateInventoryItem(item: InventoryItem) {
    if (!db) {
        throw new Error("Database is not configured. Please check your Firebase credentials in .env.");
    }

    const { id, ...newItemData } = item;
    const newName = newItemData.name;
    const itemRef = doc(db, 'inventory', id);

    const itemDoc = await getDoc(itemRef);
    if (!itemDoc.exists()) {
        throw new Error("Inventory item not found.");
    }
    const oldName = itemDoc.data().name;

    // If the name hasn't changed, just update the other fields without cascading.
    if (oldName === newName) {
        await updateDoc(itemRef, newItemData);
        revalidatePath('/');
        return;
    }

    // Name has changed, perform cascading updates using a batch write.
    const batch = writeBatch(db);
    const oldNameLower = oldName.toLowerCase();

    // 1. Update the inventory item itself
    batch.update(itemRef, newItemData);

    // 2. Update recipes
    const recipesSnapshot = await getDocs(collection(db, 'recipes'));
    recipesSnapshot.forEach(recipeDoc => {
        const recipe = recipeDoc.data() as Recipe;
        let needsUpdate = false;
        const updatedIngredients = recipe.ingredients.map(ing => {
            if (ing.name.toLowerCase() === oldNameLower) {
                needsUpdate = true;
                return { ...ing, name: newName }; // Use the new name with its original casing
            }
            return ing;
        });

        if (needsUpdate) {
            batch.update(recipeDoc.ref, { ingredients: updatedIngredients });
        }
    });

    // 3. Update products
    const productsDocRef = doc(db, 'appData', 'products');
    const productsDoc = await getDoc(productsDocRef);
    if (productsDoc.exists()) {
        const productsData = productsDoc.data().data as AllProductsData;
        let needsUpdate = false;
        const newProductsData: AllProductsData = {};

        for (const [productName, productConfig] of Object.entries(productsData)) {
            const newIngredients: { [ingredientName: string]: IngredientData } = {};
            let ingredientNameChangedInProduct = false;
            for (const [ingredientName, ingredientData] of Object.entries(productConfig.ingredients)) {
                if (ingredientName.toLowerCase() === oldNameLower) {
                    // Use the new name (lowercased) as the key
                    newIngredients[newName.toLowerCase()] = ingredientData;
                    ingredientNameChangedInProduct = true;
                } else {
                    newIngredients[ingredientName] = ingredientData;
                }
            }
            
            if (ingredientNameChangedInProduct) {
                newProductsData[productName] = {
                    ...productConfig,
                    ingredients: newIngredients
                };
                needsUpdate = true;
            } else {
                 newProductsData[productName] = productConfig;
            }
        }

        if (needsUpdate) {
            batch.set(productsDocRef, { data: newProductsData });
        }
    }

    // 4. Update daily usage records
    const dailyUsageSnapshot = await getDocs(collection(db, 'dailyUsage'));
    dailyUsageSnapshot.forEach(usageDoc => {
        const usageRecord = usageDoc.data();
        let needsUpdate = false;
        const updatedUsage = usageRecord.usage.map((usageItem: DailyUsageIngredient) => {
            if (usageItem.name.toLowerCase() === oldNameLower) {
                needsUpdate = true;
                return { ...usageItem, name: newName }; // Use new name with original casing
            }
            return usageItem;
        });

        if (needsUpdate) {
            batch.update(usageDoc.ref, { usage: updatedUsage });
        }
    });

    await batch.commit();
    revalidatePath('/');
}


export async function deleteInventoryItem(itemId: string) {
    checkDb();
    await deleteDoc(doc(db!, 'inventory', itemId));
    revalidatePath('/');
}

// --- Daily Usage Actions ---
export async function addDailyUsageRecord(record: { usage: { name: string, amount: number, unit: string }[], department: 'rotiManis' | 'donut' }) {
    checkDb();
    await addDoc(collection(db!, 'dailyUsage'), {
        date: Timestamp.now(),
        usage: record.usage,
        department: record.department,
    });
    revalidatePath('/');
}

export async function resetDailyUsage() {
    checkDb();
    const usageCollectionRef = collection(db!, 'dailyUsage');
    const querySnapshot = await getDocs(usageCollectionRef);
    const batch = writeBatch(db!);
    querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
    });
    await batch.commit();
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
