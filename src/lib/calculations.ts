
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

// Helper to get a product's divisor, with a fallback to prevent errors.
const getDivisor = (productName: string, productIngredientsData: AllProductsData): number => {
    const divisor = productIngredientsData[productName]?.calculation?.divisor;
    // Fallback to 1 if divisor is not defined, 0, or negative to avoid division by zero errors.
    return (divisor && divisor > 0) ? divisor : 1;
};

export function calculateProductionMetrics(inputs: ProductionInputs, productIngredientsData: AllProductsData) {
    // Sanitize inputs to ensure they are always numbers, defaulting to 0 to prevent NaN errors.
    const numInputs: { [key: string]: number } = {};
    for (const key of Object.keys(inputs)) {
        numInputs[key] = Number(inputs[key]) || 0;
    }

    const productionCalculations: [string, string][] = [];

    // --- Testing only the hardcoded formulas that were previously not appearing ---

    const creamCheeseResep = (((numInputs['red velvet cream cheese'] || 0) * 48) / 10000);
    productionCalculations.push(["Cream Cheese", `${creamCheeseResep.toFixed(2)} resep`]);

    const butterResep = (((numInputs['cream choco cheese'] || 0) * 17 + (numInputs['cheese roll'] || 0) * 13) / 9000);
    productionCalculations.push(["Butter", `${butterResep.toFixed(2)} resep`]);

    const butterDonatResep = (((numInputs['donut paha ayam'] || 0) * 12) / 10000);
    productionCalculations.push(["Butter Donat", `${butterDonatResep.toFixed(2)} resep`]);

    const coklatGanacheResep = (((numInputs['double coklat'] || 0) * 17) / 6000);
    productionCalculations.push(["Coklat Ganache", `${coklatGanacheResep.toFixed(2)} resep`]);

    const toppingMaxicanaResep = (((numInputs['maxicana coklat'] || 0) * 10) / 13100);
    productionCalculations.push(["Topping Maxicana", `${toppingMaxicanaResep.toFixed(2)} resep`]);

    const flaAbonTaiwanResep = (((numInputs['abon taiwan'] || 0) * 30) / 328);
    productionCalculations.push(["Fla Abon Taiwan", `${flaAbonTaiwanResep.toFixed(2)} resep`]);

    const adonanAbonTaiwanResep = ((numInputs['abon taiwan'] || 0) / 4);
    productionCalculations.push(["Adonan Abon Taiwan", `${adonanAbonTaiwanResep.toFixed(2)} resep (*kali 2 telur)`]);

    // The ingredient summary is not yet implemented. This will be a separate step.
    const ingredientSummary: [string, string, string][] = [];
    
    return {
        productionCalculations,
        ingredientSummary,
    };
}

export const initialMetrics = {
    productionCalculations: [] as [string, string][],
    ingredientSummary: [] as [string, string, string][]
};
