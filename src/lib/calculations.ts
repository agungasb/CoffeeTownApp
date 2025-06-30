
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

    const getDivisor = (productName: string, fallback: number): number => {
        return productIngredientsData[productName]?.calculation?.divisor || fallback;
    };
    
    // --- Start of Base Calculations ---
    const productionCalculations: [string, string][] = [];

    // Total Roll
    const totalRollValue = (
        ( (numInputs['abon piramid'] || 0) / getDivisor('abon piramid', 11) ) +
        ( (numInputs['abon roll pedas'] || 0) / getDivisor('abon roll pedas', 12) ) +
        ( (numInputs['cheese roll'] || 0) / getDivisor('cheese roll', 12) )
    ) / 12;
    productionCalculations.push(["Total Roll", `${totalRollValue.toFixed(2)} loyang`]);
    
    // Total Roti
    const totalRoti = Object.values(numInputs).reduce((sum, current) => sum + (current || 0), 0);
    productionCalculations.push(["Total Roti", `${totalRoti.toFixed(0)} pcs`]);

    // Total Box Tray
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
        (numInputs['kacang merah'] || 0) / 15 +
        (numInputs['maxicana coklat'] || 0) / 15 +
        (numInputs['red velvet cream cheese'] || 0) / 15 +
        (numInputs['sosis label'] || 0) / 15 +
        (numInputs['strawberry almond'] || 0) / 15 +
        (numInputs['vanilla oreo'] || 0) / 15 +
        (numInputs['abon taiwan'] || 0) / 15
    );
    productionCalculations.push(["Total Box Tray", `${totalBoxTray.toFixed(2)} pcs`]);

    // Total Loyang
    let totalLoyang = 0;
    for (const [productName, quantity] of Object.entries(numInputs)) {
        if (quantity > 0) {
            const productData = productIngredientsData[productName];
            const divisor = productData?.calculation?.divisor;
            if (divisor && divisor > 0) {
                totalLoyang += quantity / divisor;
            }
        }
    }
    productionCalculations.push(["Total Loyang", `${totalLoyang.toFixed(2)} pcs`]);

    // Total Slongsong
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


    // --- Recipe and Ingredient Summary Calculations ---
    const ingredientTotals: Record<string, { amount: number, unit: string }> = {};

    for (const [productName, quantity] of Object.entries(numInputs)) {
        const productKey = productName as keyof typeof productIngredientsData;
        if (quantity > 0 && productIngredientsData[productKey]) {
            const ingredients = productIngredientsData[productKey].ingredients;
            if (ingredients) {
                for (const [ingredient, data] of Object.entries(ingredients)) {
                    if (!ingredientTotals[ingredient]) {
                        ingredientTotals[ingredient] = { amount: 0, unit: data.unit };
                    }
                    ingredientTotals[ingredient].amount += data.amount * quantity;
                }
            }
        }
    }

    const recipeCalculations: [string, string][] = [];
    const recipeIngredientNames = new Set<string>();

    const orderedRecipeMetrics = [
        "Egg Cream",
        "Cream Cheese",
        "Butter",
        "Butter Donat",
        "Coklat Ganache",
        "Topping Maxicana",
        "Fla Abon Taiwan",
        "Adonan Abon Taiwan",
    ];

    for (const recipeName of orderedRecipeMetrics) {
        const lowerRecipeName = recipeName.toLowerCase();
        const recipeDef = initialRecipesData.find(r => r.name.toLowerCase() === lowerRecipeName);
        
        let totalAmountNeeded = 0;
        // Find the ingredient that matches the recipe name, case-insensitively
        const ingredientKey = Object.keys(ingredientTotals).find(k => k.toLowerCase() === lowerRecipeName);

        if (ingredientKey) {
            totalAmountNeeded = ingredientTotals[ingredientKey].amount;
        }

        if (recipeDef && totalAmountNeeded > 0) {
            // The recipe weight for "Adonan Abon Taiwan" is a special case (1 resep for 4 pcs), so we treat its weight as 1 unit.
            const recipeWeight = lowerRecipeName === 'adonan abon taiwan' 
                ? 1 
                : recipeDef.ingredients.reduce((sum: number, ing: { amount: number; }) => sum + ing.amount, 0);

            if (recipeWeight > 0) {
                const resepCount = totalAmountNeeded / recipeWeight;
                let displayText = `${resepCount.toFixed(2)} resep`;
                if(recipeName === "Adonan Abon Taiwan") {
                    displayText += ` (*kali 2 telur)`;
                }
                recipeCalculations.push([recipeName, displayText]);
                // We use the original case `recipeName` here to make sure it's filtered correctly from the summary.
                recipeIngredientNames.add(recipeName);
            }
        }
    }
    
    // Combine all calculations in the desired order
    const finalCalculations = [ ...productionCalculations, ...recipeCalculations ];

    // Filter out the component recipes from the final ingredient summary
    const finalIngredientSummary = Object.entries(ingredientTotals)
        .filter(([name]) => !recipeIngredientNames.has(name))
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([name, data]) => {
            return [name, data.amount.toFixed(2), data.unit];
        });

    return {
        productionCalculations: finalCalculations,
        ingredientSummary: finalIngredientSummary,
    };
}

export const initialMetrics = {
    productionCalculations: [] as [string, string][],
    ingredientSummary: [] as [string, string, string][]
};
