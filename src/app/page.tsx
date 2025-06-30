
import BakeryApp from '@/components/bakery-app';
import { collection, getDocs, writeBatch, doc, getDoc, Timestamp, query, orderBy, limit, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { recipes as initialRecipesData, Recipe } from '@/lib/recipes';
import { productIngredientsData as initialProductData, AllProductsData } from '@/lib/productIngredients';
import { inventoryData as initialInventoryData, InventoryItem } from '@/lib/inventoryData';
import {
  addRecipe,
  updateRecipe,
  deleteRecipe,
  updateProducts,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  addDailyUsageRecord,
  resetDailyUsage,
} from '@/app/actions';
import type { DailyUsageRecord } from '@/components/bakery-app';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function fetchDataAndSeed() {
    if (!db) {
        throw new Error("Firebase config is incomplete. Please make sure all 6 NEXT_PUBLIC_FIREBASE_... variables are correctly set in your .env file.");
    }
    
    // Check if data has been seeded using a persistent flag.
    const seedFlagRef = doc(db, 'appData', 'seedFlag');
    const seedFlagDoc = await getDoc(seedFlagRef);

    if (!seedFlagDoc.exists()) {
        console.log("Seeding flag not found. Seeding initial data for the first time...");
        const batch = writeBatch(db);
        
        // Seed Recipes
        initialRecipesData.forEach(recipe => {
            const docRef = doc(collection(db, 'recipes'));
            batch.set(docRef, recipe);
        });

        // Seed Products
        const productsDocRef = doc(db, 'appData', 'products');
        batch.set(productsDocRef, { data: initialProductData });
        
        // Seed Inventory
        initialInventoryData.forEach(item => {
            const docRef = doc(collection(db, 'inventory'));
            batch.set(docRef, item);
        });

        // Set the seeding flag so this process only ever runs once.
        batch.set(seedFlagRef, { isSeeded: true, seededAt: Timestamp.now() });
        
        try {
            await batch.commit();
            console.log("Successfully committed seed data to database.");
        } catch (error) {
            console.error("CRITICAL: Failed to commit seed data batch.", error);
            throw new Error(`Failed to initialize database. Could not write seed data. Please check Firestore permissions and security rules. Original error: ${(error as Error).message}`);
        }
    }

    // 2. Fetch all data for the application directly from Firestore.
    const recipesSnapshot = await getDocs(collection(db, 'recipes'));
    const recipes: Recipe[] = recipesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Recipe));

    const productsDoc = await getDoc(doc(db, 'appData', 'products'));
    const products: AllProductsData = productsDoc.exists() ? productsDoc.data().data : {};

    const inventorySnapshot = await getDocs(collection(db, 'inventory'));
    let inventory: InventoryItem[] = inventorySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as InventoryItem));

    // Data migration: ensure all inventory items have a department.
    // This handles data that existed before the 'department' field was introduced.
    const migrationBatch = writeBatch(db);
    let migrationBatchHasUpdates = false;
    inventory = inventory.map(item => {
        if (!item.department) {
            const docRef = doc(db, 'inventory', item.id);
            // Default existing items to 'rotiManis'
            migrationBatch.update(docRef, { department: 'rotiManis' });
            migrationBatchHasUpdates = true;
            // Update the item in memory immediately for the current page load
            return { ...item, department: 'rotiManis' };
        }
        return item;
    });

    if (migrationBatchHasUpdates) {
        console.log("Performing one-time data migration for inventory items...");
        await migrationBatch.commit();
        console.log("Inventory migration complete.");
    }


    const dailyUsageSnapshot = await getDocs(query(collection(db, 'dailyUsage'), orderBy('date', 'desc')));
    const dailyUsage: DailyUsageRecord[] = dailyUsageSnapshot.docs.map(doc => {
        const data = doc.data();
        return { 
            id: doc.id, 
            date: (data.date as Timestamp).toDate(),
            usage: data.usage
        };
    });

    return { recipes, products, inventory, dailyUsage };
}


export default async function Page() {
    const errorStrings = {
        title: "Application Error",
        message: "Could not connect to the database. Please check the following:",
        check1: "Ensure all 6 <strong>NEXT_PUBLIC_FIREBASE_...</strong> variables are correctly set in your <code>.env</code> file.",
        check2: "Make sure you have created a <strong>Firestore Database</strong> in your Firebase project and started it in <strong>test mode</strong>.",
        check3: "Verify that the <strong>Cloud Firestore API</strong> is enabled in your Google Cloud console.",
        details: "Error Details:"
    };

    try {
        const { recipes, products, inventory, dailyUsage } = await fetchDataAndSeed();

        const serverActions = {
            addRecipe,
            updateRecipe,
            deleteRecipe,
            updateProducts,
            addInventoryItem,
            updateInventoryItem,
            deleteInventoryItem,
            addDailyUsageRecord,
            resetDailyUsage
        };

        return (
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-12 w-12 animate-spin" /></div>}>
                <BakeryApp
                    initialRecipes={recipes}
                    initialProducts={products}
                    initialInventory={inventory}
                    initialDailyUsage={dailyUsage}
                    actions={serverActions}
                />
            </Suspense>
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return (
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="w-full max-w-2xl p-8 text-center text-red-200 bg-red-900/50 rounded-lg shadow-lg glassmorphic border border-red-500">
                    <h1 className="text-2xl font-bold mb-4">{errorStrings.title}</h1>
                    <p className="mb-2">{errorStrings.message}</p>
                    <ul className="text-left list-disc list-inside mb-6 space-y-2">
                        <li dangerouslySetInnerHTML={{ __html: errorStrings.check1 }} />
                        <li dangerouslySetInnerHTML={{ __html: errorStrings.check2 }} />
                        <li dangerouslySetInnerHTML={{ __html: errorStrings.check3 }} />
                    </ul>
                    <div className="p-4 mt-4 text-xs text-left bg-black/30 rounded-md overflow-x-auto">
                        <p className="font-bold">{errorStrings.details}</p>
                        <pre className="whitespace-pre-wrap">{errorMessage}</pre>
                    </div>
                </div>
            </div>
        );
    }
}
