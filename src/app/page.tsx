
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
import { productDepartments } from '@/lib/products';

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
            const docRef = doc(db, 'recipes', recipe.id);
            batch.set(docRef, recipe);
        });

        // Seed Products
        const productsDocRef = doc(db, 'appData', 'products');
        batch.set(productsDocRef, { data: initialProductData });
        
        // Seed Inventory
        initialInventoryData.forEach(item => {
            const docRef = doc(db, 'inventory', item.id);
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
    let recipes: Recipe[] = recipesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Recipe));

    const productsDoc = await getDoc(doc(db, 'appData', 'products'));
    let products: AllProductsData = productsDoc.exists() ? productsDoc.data().data : {};

    const inventorySnapshot = await getDocs(collection(db, 'inventory'));
    let inventory: InventoryItem[] = inventorySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as InventoryItem));

    // --- Data Migrations ---

    // Migration to add Donut Department inventory items if they are missing.
    const donutInventoryMigrationFlagRef = doc(db, 'appData', 'donutInventoryMigrationFlag_v2');
    const donutInventoryMigrationFlagDoc = await getDoc(donutInventoryMigrationFlagRef);

    if (!donutInventoryMigrationFlagDoc.exists()) {
        console.log("Performing one-time data migration for donut inventory items...");
        
        const existingItemIds = new Set(inventory.map(item => item.id));
        const donutItemsToAdd = initialInventoryData.filter(item => 
            item.department === 'donut' && !existingItemIds.has(item.id)
        );

        if (donutItemsToAdd.length > 0) {
            const migrationBatch = writeBatch(db);
            donutItemsToAdd.forEach(item => {
                const docRef = doc(db, 'inventory', item.id);
                migrationBatch.set(docRef, item);
            });
            
            migrationBatch.set(donutInventoryMigrationFlagRef, { isMigrated: true, migratedAt: Timestamp.now() });
            
            await migrationBatch.commit();
            console.log(`Successfully migrated ${donutItemsToAdd.length} new donut inventory items.`);
            
            // Re-fetch inventory data to include the new items for the current render.
            const newInventorySnapshot = await getDocs(collection(db, 'inventory'));
            inventory = newInventorySnapshot.docs.map(docSnapshot => ({ ...docSnapshot.data(), id: docSnapshot.id } as InventoryItem));
        } else {
            console.log("No new donut inventory items to migrate. Setting flag to prevent future checks.");
            await setDoc(donutInventoryMigrationFlagRef, { isMigrated: true, migratedAt: Timestamp.now() });
        }
    }

    // Migration for Roti Sobek department data
    const rotiSobekMigrationFlagRef = doc(db, 'appData', 'rotiSobekMigrationFlag_v1');
    const rotiSobekMigrationFlagDoc = await getDoc(rotiSobekMigrationFlagRef);

    if (!rotiSobekMigrationFlagDoc.exists()) {
        console.log("Performing one-time data migration for Roti Sobek department...");
        const migrationBatch = writeBatch(db);

        // 1. Add Roti Sobek inventory
        const existingInventoryIds = new Set(inventory.map(item => item.id));
        const sobekInventoryToAdd = initialInventoryData.filter(item => 
            item.department === 'rotiSobek' && !existingInventoryIds.has(item.id)
        );
        sobekInventoryToAdd.forEach(item => {
            const docRef = doc(db, 'inventory', item.id);
            migrationBatch.set(docRef, item);
        });

        // 2. Add Roti Sobek recipe
        const existingRecipeIds = new Set(recipes.map(r => r.id));
        const sobekRecipeToAdd = initialRecipesData.find(r => r.id === 'adonan_roti_sobek');
        if (sobekRecipeToAdd && !existingRecipeIds.has(sobekRecipeToAdd.id)) {
            const docRef = doc(db, 'recipes', sobekRecipeToAdd.id);
            migrationBatch.set(docRef, sobekRecipeToAdd);
        }

        // 3. Add Roti Sobek products
        const sobekProductsToAdd: { [key: string]: any } = {};
        const sobekProductNames = productDepartments.rotiSobek;
        sobekProductNames.forEach(productName => {
            if (!products[productName]) {
                sobekProductsToAdd[productName] = initialProductData[productName];
            }
        });
        if (Object.keys(sobekProductsToAdd).length > 0) {
            const productsDocRef = doc(db, 'appData', 'products');
            migrationBatch.set(productsDocRef, { data: { ...products, ...sobekProductsToAdd } }, { merge: true });
        }
        
        // 4. Set migration flag and commit
        migrationBatch.set(rotiSobekMigrationFlagRef, { isMigrated: true, migratedAt: Timestamp.now() });
        await migrationBatch.commit();
        console.log("Roti Sobek data migration complete.");

        // Re-fetch all data to reflect the migration for the current render
        const newRecipesSnapshot = await getDocs(collection(db, 'recipes'));
        recipes = newRecipesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Recipe));

        const newProductsDoc = await getDoc(doc(db, 'appData', 'products'));
        products = newProductsDoc.exists() ? newProductsDoc.data().data : {};

        const newInventorySnapshot = await getDocs(collection(db, 'inventory'));
        inventory = newInventorySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as InventoryItem));
    }


    // Migration for inventory items missing a 'department'.
    const inventoryMigrationBatch = writeBatch(db);
    let inventoryMigrationRequired = false;
    inventory = inventory.map(item => {
        if (!item.department) {
            const docRef = doc(db, 'inventory', item.id);
            // Default existing items to 'rotiManis'
            inventoryMigrationBatch.update(docRef, { department: 'rotiManis' });
            inventoryMigrationRequired = true;
            return { ...item, department: 'rotiManis' };
        }
        return item;
    });

    if (inventoryMigrationRequired) {
        console.log("Performing one-time data migration for inventory items...");
        await inventoryMigrationBatch.commit();
        console.log("Inventory migration complete.");
    }
    
    // Migration for products missing 'ingredients' or 'calculation' data.
    let productsMigrationRequired = false;
    for (const productName in initialProductData) {
        const masterData = initialProductData[productName];
        const liveData = products[productName];

        if (!liveData || !liveData.ingredients || !liveData.calculation) {
            products[productName] = {
                ...masterData, // Start with the master template
                ...liveData,   // Then apply any existing live data over it
            };
            productsMigrationRequired = true;
        }
    }

    if (productsMigrationRequired) {
        console.log("Performing one-time data migration for products...");
        const productsDocRef = doc(db, 'appData', 'products');
        await setDoc(productsDocRef, { data: products });
        console.log("Product data migration complete.");
    }


    const dailyUsageSnapshot = await getDocs(query(collection(db, 'dailyUsage'), orderBy('date', 'desc')));
    let dailyUsage: DailyUsageRecord[] = dailyUsageSnapshot.docs.map(doc => {
        const data = doc.data();
        return { 
            id: doc.id, 
            date: (data.date as Timestamp).toDate(),
            usage: data.usage,
            department: data.department
        };
    });

    // Migration for daily usage records missing a 'department'.
    const usageMigrationFlagRef = doc(db, 'appData', 'usageDepartmentMigrationFlag');
    const usageMigrationFlagDoc = await getDoc(usageMigrationFlagRef);

    if (!usageMigrationFlagDoc.exists()) {
        console.log("Performing one-time data migration for daily usage records...");
        const usageMigrationBatch = writeBatch(db);
        let migrationNeeded = false;
        
        dailyUsageSnapshot.docs.forEach(docSnapshot => {
            const data = docSnapshot.data();
            if (data.department === undefined) {
                migrationNeeded = true;
                usageMigrationBatch.update(docSnapshot.ref, { department: 'rotiManis' });
            }
        });

        if (migrationNeeded) {
            usageMigrationBatch.set(usageMigrationFlagRef, { isMigrated: true, migratedAt: Timestamp.now() });
            await usageMigrationBatch.commit();
            console.log("Daily usage migration complete.");
            // Re-fetch data to reflect migration
            const migratedSnapshot = await getDocs(query(collection(db, 'dailyUsage'), orderBy('date', 'desc')));
            dailyUsage = migratedSnapshot.docs.map(doc => {
                 const data = doc.data();
                 return { 
                    id: doc.id, 
                    date: (data.date as Timestamp).toDate(),
                    usage: data.usage,
                    department: data.department
                };
            });
        } else {
            // Set flag even if no migration was needed to prevent re-running this check.
            await setDoc(usageMigrationFlagRef, { isMigrated: true, migratedAt: Timestamp.now() });
        }
    }


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
