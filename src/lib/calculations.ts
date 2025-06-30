
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

// Helper to get a product's divisor, with a fallback.
const getDivisor = (productName: string, productIngredientsData: AllProductsData): number => {
    const divisor = productIngredientsData[productName]?.calculation?.divisor;
    // Fallback to 1 if divisor is not defined, 0, or negative to avoid division by zero errors.
    return (divisor && divisor > 0) ? divisor : 1;
};

export function calculateProductionMetrics(inputs: ProductionInputs, productIngredientsData: AllProductsData) {
    const numInputs: { [key: string]: number } = {};
    for (const key of Object.keys(inputs)) {
        numInputs[key] = Number(inputs[key]) || 0;
    }

    const productionCalculations: [string, string][] = [];

    // --- Direct translation of all formulas from HTML ---

    const totalRollValue = (
        ( (numInputs['abon piramid'] || 0) / getDivisor('abon piramid', productIngredientsData) ) +
        ( (numInputs['abon roll pedas'] || 0) / getDivisor('abon roll pedas', productIngredientsData) ) +
        ( (numInputs['cheese roll'] || 0) / getDivisor('cheese roll', productIngredientsData) )
    ) / 12;
    productionCalculations.push(["Total Roll", `${totalRollValue.toFixed(2)} loyang`]);

    const totalRoti = Object.values(numInputs).reduce((sum, current) => sum + (current || 0), 0);
    productionCalculations.push(["Total Roti", `${totalRoti.toFixed(0)} pcs`]);

    const totalBoxTray = (
        ((numInputs['abon ayam pedas'] || 0) / 15) +
        ((numInputs['abon piramid'] || 0) / 20) +
        ((numInputs['abon roll pedas'] || 0) / 25) +
        ((numInputs['abon sosis'] || 0) / 15) +
        ((numInputs['cheese roll'] || 0) / 35) +
        ((numInputs['cream choco cheese'] || 0) / 12) +
        ((numInputs['donut paha ayam'] || 0) / 15) +
        ((numInputs['double coklat'] || 0) / 15) +
        ((numInputs['hot sosis'] || 0) / 15) +
        ((numInputs['kacang merah'] || 0) / 15) +
        ((numInputs['maxicana coklat'] || 0) / 15) +
        ((numInputs['red velvet cream cheese'] || 0) / 15) +
        ((numInputs['sosis label'] || 0) / 15) +
        ((numInputs['strawberry almond'] || 0) / 15) +
        ((numInputs['vanilla oreo'] || 0) / 15) +
        ((numInputs['abon taiwan'] || 0) / 15)
    );
    productionCalculations.push(["Total Box Tray", `${totalBoxTray.toFixed(2)} pcs`]);

    let totalLoyang = 0;
    for (const [productName, quantity] of Object.entries(numInputs)) {
        if (quantity > 0 && productIngredientsData[productName]) {
            totalLoyang += quantity / getDivisor(productName, productIngredientsData);
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

    const eggCreamResep = (( (numInputs['abon ayam pedas'] || 0) * 18 + (numInputs['abon sosis'] || 0) * 10 + (numInputs['abon piramid'] || 0) * 24 + (numInputs['abon roll pedas'] || 0) * 18) / 22260);
    productionCalculations.push(["Egg Cream", `${eggCreamResep.toFixed(2)} resep`]);

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
