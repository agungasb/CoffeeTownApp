import BakeryApp from '@/components/bakery-app';
import { collection, getDocs, writeBatch, doc, getDoc, Timestamp, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { recipes as initialRecipesData, Recipe } from '@/lib/recipes';
import { productIngredientsData as initialProductData, ProductIngredients } from '@/lib/productIngredients';
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
} from './actions';
import { DailyUsageRecord } from '@/components/bakery-app';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';


async function seedDatabase() {
    if (!db) return; // Guard against null db

    try {
        const batch = writeBatch(db);
        let operations = 0;

        // 1. Seed Recipes
        const recipesSnapshot = await getDocs(query(collection(db, 'recipes'), limit(1)));
        if (recipesSnapshot.empty) {
            console.log("Database empty, seeding recipes...");
            initialRecipesData.forEach(recipe => {
                const docRef = doc(db, 'recipes', recipe.id);
                batch.set(docRef, recipe);
            });
            operations++;
        }

        // 2. Seed Products
        const productsDocRef = doc(db, 'appData', 'products');
        const productsDoc = await getDoc(productsDocRef);
        if (!productsDoc.exists()) {
            console.log("Database empty, seeding products...");
            batch.set(productsDocRef, { data: initialProductData });
            operations++;
        }
        
        // 3. Seed Inventory
        const inventorySnapshot = await getDocs(query(collection(db, 'inventory'), limit(1)));
        if (inventorySnapshot.empty) {
             console.log("Database empty, seeding inventory...");
            initialInventoryData.forEach(item => {
                const docRef = doc(db, 'inventory', item.id);
                batch.set(docRef, item);
            });
            operations++;
        }

        if (operations > 0) {
            console.log("Committing seed data to database...");
            await batch.commit();
            console.log("Seeding complete.");
        }
    } catch (error) {
        console.error("Error seeding database:", error);
        // We can throw the error to be caught by the error boundary
        throw new Error("Failed to initialize database. Please check Firestore permissions and configuration.");
    }
}


async function fetchData() {
    if (!db) {
        throw new Error("Firebase config is incomplete. Please make sure all 6 NEXT_PUBLIC_FIREBASE_... variables are correctly set in your .env file.");
    }
    
    await seedDatabase();

    const recipesSnapshot = await getDocs(collection(db, 'recipes'));
    const recipes: Recipe[] = recipesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Recipe));

    const productsDoc = await getDoc(doc(db, 'appData', 'products'));
    const products: ProductIngredients = productsDoc.exists() ? productsDoc.data().data : {};

    const inventorySnapshot = await getDocs(collection(db, 'inventory'));
    const inventory: InventoryItem[] = inventorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InventoryItem));

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
    try {
        const { recipes, products, inventory, dailyUsage } = await fetchData();

        const serverActions = {
            addRecipe,
            updateRecipe,
            deleteRecipe,
            updateProducts,
            addInventoryItem,
            updateInventoryItem,
            deleteInventoryItem,
            addDailyUsageRecord
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
                    <h1 className="text-2xl font-bold mb-4">Application Error</h1>
                    <p className="mb-2">Could not connect to the database. Please check the following:</p>
                    <ul className="text-left list-disc list-inside mb-6 space-y-2">
                        <li>Ensure all 6 <strong>NEXT_PUBLIC_FIREBASE_...</strong> variables are correctly set in your <code>.env</code> file.</li>
                        <li>Make sure you have created a <strong>Firestore Database</strong> in your Firebase project and started it in <strong>test mode</strong>.</li>
                        <li>Verify that the <strong>Cloud Firestore API</strong> is enabled in your Google Cloud console.</li>
                    </ul>
                    <div className="p-4 mt-4 text-xs text-left bg-black/30 rounded-md overflow-x-auto">
                        <p className="font-bold">Error Details:</p>
                        <pre className="whitespace-pre-wrap">{errorMessage}</pre>
                    </div>
                </div>
            </div>
        );
    }
}

// Add a loading component for better user experience
Page.Loading = function Loading() {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-12 w-12 animate-spin" /></div>;
}
