
import { z } from "zod";
import type { AllProductsData } from "./productIngredients";
import { recipes as initialRecipesData } from './recipes';

// This function creates a Zod schema dynamically based on a list of product names.
export function createProductionSchema(products: string[]) {
    const shape = products.reduce((acc, item) => {
        acc[item] = z.coerce.number().min(0).default(0);
        return acc;
    }, {} as Record<string, z.ZodType<number, any, number>>);
    return z.object(shape);
}

export type ProductionInputs = Record<string, number>;

export function calculateProductionMetrics(inputs: ProductionInputs, productIngredientsData: AllProductsData) {
    const numInputs: { [key: string]: number } = {};
    for (const key of Object.keys(inputs)) {
        numInputs[key] = Number(inputs[key]) || 0;
    }

    const getDivisor = (productName: string, fallback: number = 1): number => {
        const divisor = productIngredientsData[productName]?.calculation?.divisor;
        // Ensure divisor is a positive number, otherwise default to the fallback (or 1)
        return (divisor && divisor > 0) ? divisor : fallback;
    };
    
    // --- Metric Calculations ---
    const productionCalculations: [string, string][] = [];

    // --- Start with the fixed order of metrics ---

    // 1. Total Roll
    const totalRollValue = (
        ( (numInputs['abon piramid'] || 0) / getDivisor('abon piramid') ) +
        ( (numInputs['abon roll pedas'] || 0) / getDivisor('abon roll pedas') ) +
        ( (numInputs['cheese roll'] || 0) / getDivisor('cheese roll') )
    ) / 12;
    productionCalculations.push(["Total Roll", `${totalRollValue.toFixed(2)} loyang`]);
    
    // 2. Total Roti
    const totalRoti = Object.values(numInputs).reduce((sum, current) => sum + (current || 0), 0);
    productionCalculations.push(["Total Roti", `${totalRoti.toFixed(0)} pcs`]);

    // 3. Total Box Tray
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

    // 4. Total Loyang
    let totalLoyang = 0;
    for (const [productName, quantity] of Object.entries(numInputs)) {
        if (quantity > 0) {
            totalLoyang += quantity / getDivisor(productName);
        }
    }
    productionCalculations.push(["Total Loyang", `${totalLoyang.toFixed(2)} pcs`]);
    
    // 5. Total Slongsong
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


    // --- Dynamic Recipe and Ingredient Summary Calculations ---
    const ingredientTotals: Record<string, { amount: number, unit: string }> = {};

    // First pass: aggregate all top-level ingredients, including component recipes.
    for (const [productName, quantity] of Object.entries(numInputs)) {
        const productKey = productName as keyof typeof productIngredientsData;
        if (quantity > 0 && productIngredientsData[productKey]) {
            const ingredients = productIngredientsData[productKey].ingredients;
            if (ingredients) {
                for (const [ingredient, data] of Object.entries(ingredients)) {
                    // Use a case-insensitive key for aggregation
                    const key = ingredient.toLowerCase();
                    if (!ingredientTotals[key]) {
                        // Store with original casing for unit lookup later
                        ingredientTotals[key] = { amount: 0, unit: data.unit };
                    }
                    ingredientTotals[key].amount += data.amount * quantity;
                }
            }
        }
    }

    const componentRecipesToCalculate = [
        "Egg Cream", "Cream Cheese", "Butter", "Butter Donat",
        "Coklat Ganache", "Topping Maxicana", "Fla Abon Taiwan", "Adonan Abon Taiwan"
    ];
    
    const finalRawIngredients: Record<string, { amount: number, unit: string }> = {};

    // Second pass: process component recipes and add them to the calculation results.
    for (const recipeName of componentRecipesToCalculate) {
        const lowerRecipeName = recipeName.toLowerCase();
        const componentData = ingredientTotals[lowerRecipeName];

        if (componentData && componentData.amount > 0) {
            // Handle the special case for "Adonan Abon Taiwan" which is already in "resep" units
            if (componentData.unit === 'resep') {
                let displayText = `${componentData.amount.toFixed(2)} resep`;
                if(recipeName === "Adonan Abon Taiwan") {
                    displayText += ` (*kali 2 telur)`;
                }
                productionCalculations.push([recipeName, displayText]);
            } else {
                 const recipeDef = initialRecipesData.find(r => r.name.toLowerCase() === lowerRecipeName);
                if (recipeDef) {
                    const recipeYield = recipeDef.ingredients.reduce((sum, ing) => sum + ing.amount, 0);
                    if (recipeYield > 0) {
                        const resepCount = componentData.amount / recipeYield;
                        productionCalculations.push([recipeName, `${resepCount.toFixed(2)} resep`]);
                    }
                }
            }
        }
    }
    
    return {
        productionCalculations,
        ingredientSummary: [], // Placeholder for now
    };
}

export const initialMetrics = {
    productionCalculations: [] as [string, string][],
    ingredientSummary: [] as [string, string, string][]
};
