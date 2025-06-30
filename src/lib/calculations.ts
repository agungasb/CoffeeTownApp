
import { z } from "zod";
import type { AllProductsData } from "./productIngredients";
import { recipes as initialRecipesData, Recipe } from './recipes';

// This function creates a Zod schema dynamically based on a list of product names.
export function createProductionSchema(products: string[]) {
    const shape = products.reduce((acc, item) => {
        acc[item] = z.coerce.number().min(0).default(0);
        return acc;
    }, {} as Record<string, z.ZodType<number, any, number>>);
    return z.object(shape);
}

export type ProductionInputs = Record<string, number>;

// --- Helper Data ---
const recipesByName: Record<string, Recipe> = initialRecipesData.reduce((acc, recipe) => {
    acc[recipe.name.toLowerCase()] = recipe;
    return acc;
}, {} as Record<string, Recipe>);

const recipeTotalWeights: Record<string, number> = initialRecipesData.reduce((acc, recipe) => {
    // A bit of a hack for egg cream's oil which is in ml. Assume 1ml = 1g for this calculation.
    acc[recipe.name.toLowerCase()] = recipe.ingredients.reduce((sum, ing) => sum + ing.amount, 0);
    return acc;
}, {} as Record<string, number>);


export function calculateProductionMetrics(inputs: ProductionInputs, productIngredientsData: AllProductsData) {
    const numInputs: { [key: string]: number } = {};
    for (const key of Object.keys(inputs)) {
        numInputs[key] = Number(inputs[key]) || 0;
    }

    const getDivisor = (productName: string): number => {
        const divisor = productIngredientsData[productName]?.calculation?.divisor;
        return (divisor && divisor > 0) ? divisor : 1;
    };

    const productionCalculations: [string, string][] = [];
    const ingredientSummaryMap: Record<string, { amount: number; unit: string }> = {};
    const recipeResepMap: Record<string, number> = {};

    // --- SECTION 1: Fixed Calculations (Total Roll, Roti, etc.) ---
    const totalRollValue = (
        ( (numInputs['abon piramid'] || 0) / getDivisor('abon piramid') ) +
        ( (numInputs['abon roll pedas'] || 0) / getDivisor('abon roll pedas') ) +
        ( (numInputs['cheese roll'] || 0) / getDivisor('cheese roll') )
    ) / 12;
    productionCalculations.push(["Total Roll", `${totalRollValue.toFixed(2)} loyang`]);
    
    const totalRoti = Object.values(numInputs).reduce((sum, current) => sum + (current || 0), 0);
    productionCalculations.push(["Total Roti", `${totalRoti.toFixed(0)} pcs`]);

    const totalBoxTray = (
        (numInputs['abon ayam pedas'] || 0) / 15 +
        (numInputs['abon piramid'] || 0) / 20 +
        (numInputs['abon roll pedas'] || 0) / 25 +
        (numInputs['abon sosis'] || 0) / 15 +
        (numInputs['cheese roll'] || 0) / 35 +
        (numInputs['cream choco cheese'] || 0) / 12 +
        (numInputs['donut paha ayam'] || 0) / 15 +
        (numInputs['double coklat'] || 0) / 15 +
        (numInputs['hot sosis'] || 0) / 15 +
        (numInputs['kacang merah'] || 0) /15 +
        (numInputs['maxicana coklat'] || 0) / 15 +
        (numInputs['red velvet cream cheese'] || 0) / 15 +
        (numInputs['sosis label'] || 0) / 15 +
        (numInputs['strawberry almond'] || 0) / 15 +
        (numInputs['vanilla oreo'] || 0) / 15 +
        (numInputs['abon taiwan'] || 0) / 15
    );
    productionCalculations.push(["Total Box Tray", `${totalBoxTray.toFixed(2)} pcs`]);

    let totalLoyang = 0;
    for (const [productName, quantity] of Object.entries(numInputs)) {
        if (quantity > 0 && productIngredientsData[productName]) {
            totalLoyang += quantity / getDivisor(productName);
        }
    }
    productionCalculations.push(["Total Loyang", `${totalLoyang.toFixed(2)} pcs`]);
    
    const totalSlongsong = (
        (
            (numInputs['abon ayam pedas'] || 0) + 
            (numInputs['cream choco cheese'] || 0) + 
            (numInputs['double coklat'] || 0) + 
            (numInputs['hot sosis'] || 0) + 
            (numInputs['strawberry almond'] || 0)
        ) / 15
    ) / 15;
    productionCalculations.push(["Total Slongsong", `${totalSlongsong.toFixed(2)} trolley (*include hot sosis)`]);

    // --- SECTION 2: Dynamic Resep and Ingredient Summary Calculations ---

    // Calculate total grams needed for each component recipe based on production inputs
    const recipeGramsNeeded: Record<string, number> = {};
    for (const [productName, quantity] of Object.entries(numInputs)) {
        if (quantity <= 0) continue;
        const productData = productIngredientsData[productName];
        if (!productData || !productData.ingredients) continue;

        for (const [ingName, ingData] of Object.entries(productData.ingredients)) {
            const key = ingName.toLowerCase();
            if (recipesByName[key] && ingData.unit === 'g') { // It's a component recipe measured in grams
                if (!recipeGramsNeeded[key]) recipeGramsNeeded[key] = 0;
                recipeGramsNeeded[key] += ingData.amount * quantity;
            }
        }
    }
    
    // Calculate resep counts and add them to the main results
    const orderedRecipeNames = [
        "egg cream", "cream cheese", "butter", "butter donat", "coklat ganache", 
        "topping maxicana", "fla abon taiwan", "adonan abon taiwan"
    ];

    for (const recipeName of orderedRecipeNames) {
        let resepCount = 0;
        if(recipeName === "adonan abon taiwan") {
            // This is a special case where the unit is 'resep' in product data
             const productData = productIngredientsData["abon taiwan"];
             if (productData) {
                resepCount = (numInputs['abon taiwan'] || 0) * (productData.ingredients['Adonan Abon Taiwan']?.amount || 0);
             }
        } else {
            const totalGrams = recipeGramsNeeded[recipeName] || 0;
            const batchWeight = recipeTotalWeights[recipeName] || 1;
            resepCount = totalGrams / batchWeight;
        }

        recipeResepMap[recipeName] = resepCount;

        let resepString = `${resepCount.toFixed(2)} resep`;
        if (recipeName === "adonan abon taiwan") {
            resepString += " (*kali 2 telur)";
        }
        productionCalculations.push([recipeName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), resepString]);
    }

    // Now, calculate the ingredient summary
    // A. Add ingredients from component recipes
    for (const [recipeName, resepCount] of Object.entries(recipeResepMap)) {
        if (resepCount <= 0) continue;
        const recipeData = recipesByName[recipeName];
        if (recipeData) {
            for (const ingredient of recipeData.ingredients) {
                const key = ingredient.name.toLowerCase();
                if (!ingredientSummaryMap[key]) {
                    ingredientSummaryMap[key] = { amount: 0, unit: ingredient.unit };
                }
                ingredientSummaryMap[key].amount += ingredient.amount * resepCount;
            }
        }
    }

    // B. Add raw ingredients that are NOT component recipes
    for (const [productName, quantity] of Object.entries(numInputs)) {
        if (quantity <= 0) continue;
        const productData = productIngredientsData[productName];
        if (!productData || !productData.ingredients) continue;

        for (const [ingName, ingData] of Object.entries(productData.ingredients)) {
            const key = ingName.toLowerCase();
            // If it's NOT a recipe, it's a raw material.
            if (!recipesByName[key]) {
                if (!ingredientSummaryMap[key]) {
                    ingredientSummaryMap[key] = { amount: 0, unit: ingData.unit };
                }
                // Handle base dough recipes which are already in "resep" units
                if (ingData.unit === 'resep') {
                    const baseDoughRecipe = recipesByName[key];
                    if (baseDoughRecipe) {
                         for (const subIng of baseDoughRecipe.ingredients) {
                            const subKey = subIng.name.toLowerCase();
                             if (!ingredientSummaryMap[subKey]) {
                                ingredientSummaryMap[subKey] = { amount: 0, unit: subIng.unit };
                            }
                            ingredientSummaryMap[subKey].amount += subIng.amount * ingData.amount * quantity;
                        }
                    }
                } else {
                     ingredientSummaryMap[key].amount += ingData.amount * quantity;
                }
            }
        }
    }

    const ingredientSummary = Object.entries(ingredientSummaryMap)
        .map(([name, data]) => [name, data.amount.toFixed(2), data.unit] as [string, string, string])
        .sort((a, b) => a[0].localeCompare(b[0]));
        
    return {
        productionCalculations,
        ingredientSummary,
    };
}

export const initialMetrics = {
    productionCalculations: [] as [string, string][],
    ingredientSummary: [] as [string, string, string][]
};
