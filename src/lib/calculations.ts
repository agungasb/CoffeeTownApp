
import { z } from "zod";
import type { AllProductsData, ProductData } from "./productIngredients";
import type { Recipe } from "./recipes";
import { capitalize } from "./utils";
import { InventoryItem } from "./inventoryData";

export function createProductionSchema(products: string[]) {
    const shape = products.reduce((acc, item) => {
        acc[item] = z.coerce.number().min(0).default(0);
        return acc;
    }, {} as Record<string, z.ZodType<number, any, number>>);
    return z.object(shape);
}

export type ProductionInputs = Record<string, number>;

// Helper to find a product in productIngredientsData, ignoring case.
const findProductData = (productName: string, allProducts: AllProductsData): ProductData | null => {
    const key = Object.keys(allProducts).find(k => k.toLowerCase() === productName.toLowerCase());
    return key ? allProducts[key] : null;
};

// Helper to find a recipe in recipes array, ignoring case.
const findRecipe = (recipeName: string, allRecipes: Recipe[]): Recipe | null => {
    return allRecipes.find(r => r.name.toLowerCase() === recipeName.toLowerCase()) || null;
}

// Helper to get recipe base weight
const getRecipeBaseWeight = (recipeName: string, allRecipes: Recipe[]): number => {
    const recipe = findRecipe(recipeName, allRecipes);
    if (!recipe) return 0;
    // Use override if it exists and is valid
    if (recipe.baseWeight && recipe.baseWeight > 0) {
        return recipe.baseWeight;
    }
    // Otherwise, calculate by summing ingredients
    return recipe.ingredients.reduce((sum, ing) => sum + ing.amount, 0);
};

export function calculateProductionMetrics(inputs: ProductionInputs, productIngredientsData: AllProductsData, allRecipes: Recipe[], inventory: InventoryItem[], department: 'rotiManis' | 'donut') {
    const numInputs: { [key: string]: number } = {};
    for (const key in inputs) {
        if (Object.prototype.hasOwnProperty.call(inputs, key)) {
            const val = inputs[key];
            numInputs[key.toLowerCase()] = (typeof val === 'number' && !isNaN(val)) ? val : 0;
        }
    }

    const productionCalculations: [string, string][] = [];
    const ingredientSummaryMap: { [key: string]: { amount: number; unit: string } } = {};

    // --- Individual Product Calculations (input / divisor) ---
    for (const productName in numInputs) {
        const quantity = numInputs[productName];
        if (quantity > 0) {
            const productData = findProductData(productName, productIngredientsData);
            if (productData?.calculation?.divisor && productData.calculation.divisor > 0) {
                const result = quantity / productData.calculation.divisor;
                const unit = productData.calculation.unit || 'loyang';
                productionCalculations.push([capitalize(productName), `${result.toFixed(2)} ${unit}`]);
            }
        }
    }

    // --- Hardcoded Total & Combined Calculations ---
    const safeGetDivisor = (productName: string): number => {
        const productData = findProductData(productName, productIngredientsData);
        return (productData?.calculation?.divisor && productData.calculation.divisor > 0) ? productData.calculation.divisor : 1;
    };
    
    // Department-specific calculations
    if (department === 'rotiManis') {
        const totalRollProducts = ["abon piramid", "abon roll pedas", "cheese roll"];
        const totalRoll = totalRollProducts.reduce((sum, p) => sum + (numInputs[p.toLowerCase()] || 0) / safeGetDivisor(p), 0) / 12;
        if (totalRoll > 0) productionCalculations.push(["Total Roll", `${totalRoll.toFixed(2)} loyang`]);

        const nonRotiProducts = new Set(["abon piramid", "abon roll pedas", "cheese roll", "donut paha ayam"]);
        const totalRotiPcs = Object.keys(numInputs).reduce((sum, p) => {
            if (nonRotiProducts.has(p.toLowerCase())) return sum;
            return sum + (numInputs[p.toLowerCase()] || 0);
        }, 0);
        if (totalRotiPcs > 0) productionCalculations.push(["Total Roti", `${totalRotiPcs.toFixed(0)} pcs`]);
        
        const totalSlongsong = numInputs['donut paha ayam'] || 0;
        if (totalSlongsong > 0) productionCalculations.push(["Total Slongsong", `${totalSlongsong.toFixed(0)} pcs`]);

        const getSausageAmountForProduct = (productName: string): number => {
            const productData = findProductData(productName, productIngredientsData);
            if (!productData || !productData.ingredients) return 0;
            const sosisKey = Object.keys(productData.ingredients).find(k => k.toLowerCase() === 'sosis');
            return sosisKey ? productData.ingredients[sosisKey].amount : 0;
        };

        const totalSosisPcs =
            (numInputs['abon sosis'] || 0) * getSausageAmountForProduct('abon sosis') +
            (numInputs['hot sosis'] || 0) * getSausageAmountForProduct('hot sosis') +
            (numInputs['sosis label'] || 0) * getSausageAmountForProduct('sosis label');

        if (totalSosisPcs > 0) {
            const sosisInventoryItem = inventory.find(item => item.name.toLowerCase() === 'sosis');
            if (sosisInventoryItem && sosisInventoryItem.orderUnitConversion && sosisInventoryItem.orderUnitConversion > 0) {
                const totalSosisOrderUnit = totalSosisPcs / sosisInventoryItem.orderUnitConversion;
                const orderUnitName = sosisInventoryItem.orderUnit || 'pack';
                productionCalculations.push(['Total Sosis', `${totalSosisOrderUnit.toFixed(2)} ${orderUnitName}`]);
            } else {
                // Fallback if conversion isn't set
                productionCalculations.push(['Total Sosis', `${totalSosisPcs.toFixed(0)} pcs`]);
            }
        }
    }

    // Generic calculations (apply to both departments)
    const totalBoxTray = Object.keys(numInputs).reduce((sum, p) => sum + (numInputs[p.toLowerCase()] || 0), 0);
    if (totalBoxTray > 0) productionCalculations.push(["Total Box Tray", `${totalBoxTray.toFixed(0)} pcs`]);

    const totalLoyang = Object.keys(numInputs).reduce((sum, p) => sum + ((numInputs[p.toLowerCase()] || 0) / safeGetDivisor(p)), 0);
    if (totalLoyang > 0) productionCalculations.push(["Total Loyang", `${totalLoyang.toFixed(2)} loyang`]);
    
    
    // --- Recipe Calculations ---

    // 1. Dough Recipes (using baseRecipe link)
    const recipeWeightTotals: { [recipeName: string]: number } = {};

    for (const productName in numInputs) {
        const quantity = numInputs[productName.toLowerCase()];
        if (quantity > 0) {
            const productData = findProductData(productName, productIngredientsData);
            if (productData?.baseRecipes) {
                for (const baseRecipe of productData.baseRecipes) {
                    const { recipeName, weight } = baseRecipe;
                    if (!recipeWeightTotals[recipeName]) {
                        recipeWeightTotals[recipeName] = 0;
                    }
                    recipeWeightTotals[recipeName] += quantity * weight;
                }
            }
        }
    }

    const recipeMultiplierMap: { [recipeName: string]: number } = {};

    for (const recipeName in recipeWeightTotals) {
        const totalDoughWeight = recipeWeightTotals[recipeName];
        if (totalDoughWeight > 0) {
            const recipeBaseWeight = getRecipeBaseWeight(recipeName, allRecipes);
            if (recipeBaseWeight > 0) {
                const recipesNeeded = totalDoughWeight / recipeBaseWeight;
                recipeMultiplierMap[recipeName] = recipesNeeded;
                if (recipeName === 'Adonan Abon Taiwan') {
                    productionCalculations.push([recipeName, `${recipesNeeded.toFixed(2)} resep (*kali 2 telur)`]);
                } else {
                    productionCalculations.push([capitalize(recipeName), `${recipesNeeded.toFixed(2)} resep`]);
                }
            }
        }
    }
    
    // 2. Other Filling/Topping Recipes (Hardcoded logic replaced by dynamic base recipe links)
    // The previous hardcoded calculations for Egg Cream, Cream Cheese, etc., are now handled by the dynamic loop above.

    // --- Ingredient Summary Calculation ---
    for (const [recipeName, recipeMultiplier] of Object.entries(recipeMultiplierMap)) {
        if (recipeMultiplier > 0) {
            const recipe = findRecipe(recipeName, allRecipes);
            if (recipe) {
                recipe.ingredients.forEach(ing => {
                    const totalAmount = ing.amount * recipeMultiplier;
                    const ingredientName = ing.name.toLowerCase();
                    if (!ingredientSummaryMap[ingredientName]) {
                        ingredientSummaryMap[ingredientName] = { amount: 0, unit: ing.unit };
                    }
                    ingredientSummaryMap[ingredientName].amount += totalAmount;
                });
            }
        }
    }
    
    // Add non-recipe ingredients from products
     for (const productName in numInputs) {
        const quantity = numInputs[productName.toLowerCase()];
        if (quantity > 0) {
            const productData = findProductData(productName, productIngredientsData);
            if (productData) {
                for (const ingName in productData.ingredients) {
                    const ingData = productData.ingredients[ingName];
                    const totalAmount = ingData.amount * quantity;
                    const ingredientName = ingName.toLowerCase();
                    if (!ingredientSummaryMap[ingredientName]) {
                        ingredientSummaryMap[ingredientName] = { amount: 0, unit: ingData.unit };
                    }
                    ingredientSummaryMap[ingredientName].amount += totalAmount;
                }
            }
        }
    }

    const capitalizedProductList = Object.keys(inputs).map(p => capitalize(p));

    const customSortOrder = [
        "Total Sosis",
        "Adonan Donat",
        "Adonan Donut Joko",
        "Adonan Donut Paha Ayam",
        "Adonan Roti Manis Roll",
        "Adonan Roti Manis Mesin",
        "Total Roll",
        "Total Roti",
        "Total Box Tray",
        "Total Loyang",
        "Total Slongsong",
        "Egg Cream",
        "Cream Cheese",
        "Butter",
        "Butter Donat",
        "Coklat Ganache",
        "Topping Maxicana",
        "Fla Abon Taiwan",
        "Adonan Abon Taiwan",
    ];

    const sortedCalculations = productionCalculations.sort((a, b) => {
        const keyA = a[0];
        const keyB = b[0];

        const isAProduct = capitalizedProductList.includes(keyA);
        const isBProduct = capitalizedProductList.includes(keyB);

        // Group product calculations at the top
        if (isAProduct && !isBProduct) return -1;
        if (!isAProduct && isBProduct) return 1;
        if (isAProduct && isBProduct) return keyA.localeCompare(keyB);

        // For non-product calculations, use the custom sort order
        const indexA = customSortOrder.indexOf(keyA);
        const indexB = customSortOrder.indexOf(keyB);

        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;

        // Fallback for any items not in the product list or custom sort order
        return keyA.localeCompare(keyB);
    });


    const ingredientSummary = Object.entries(ingredientSummaryMap)
        .map(([name, { amount, unit }]) => [capitalize(name), amount.toFixed(2), unit] as [string, string, string])
        .sort((a, b) => a[0].localeCompare(b[0]));
        
    return {
        productionCalculations: sortedCalculations,
        ingredientSummary,
    };
}


export const initialMetrics = {
    productionCalculations: [] as [string, string][],
    ingredientSummary: [] as [string, string, string][]
};
