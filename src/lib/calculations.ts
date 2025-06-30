
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
        if (quantity > 0 && productIngredientsData[productName]) {
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

    // --- Component Recipe Calculations (Hardcoded from original HTML) ---
    const eggCreamResep = ((numInputs['abon ayam pedas'] * 18 + numInputs['abon sosis'] * 10 + numInputs['abon piramid'] * 24 + numInputs['abon roll pedas'] * 18) / 22260);
    productionCalculations.push(["Egg Cream", `${eggCreamResep.toFixed(2)} resep`]);
    
    const creamCheeseResep = ((numInputs['red velvet cream cheese'] * 48) / 10000);
    productionCalculations.push(["Cream Cheese", `${creamCheeseResep.toFixed(2)} resep`]);

    const butterResep = ((numInputs['cream choco cheese'] * 17 + numInputs['cheese roll'] * 13) / 9000);
    productionCalculations.push(["Butter", `${butterResep.toFixed(2)} resep`]);

    const butterDonatResep = ((numInputs['donut paha ayam'] * 12) / 10000);
    productionCalculations.push(["Butter Donat", `${butterDonatResep.toFixed(2)} resep`]);
    
    const coklatGanacheResep = ((numInputs['double coklat'] * 17) / 6000);
    productionCalculations.push(["Coklat Ganache", `${coklatGanacheResep.toFixed(2)} resep`]);

    const toppingMaxicanaResep = ((numInputs['maxicana coklat'] * 10) / 13100);
    productionCalculations.push(["Topping Maxicana", `${toppingMaxicanaResep.toFixed(2)} resep`]);
    
    const flaAbonTaiwanResep = ((numInputs['abon taiwan'] * 30) / 328);
    productionCalculations.push(["Fla Abon Taiwan", `${flaAbonTaiwanResep.toFixed(2)} resep`]);

    const adonanAbonTaiwanResep = (numInputs['abon taiwan'] / 4);
    productionCalculations.push(["Adonan Abon Taiwan", `${adonanAbonTaiwanResep.toFixed(2)} resep (*kali 2 telur)`]);
    
    return {
        productionCalculations,
        ingredientSummary: [], // Placeholder for now
    };
}

export const initialMetrics = {
    productionCalculations: [] as [string, string][],
    ingredientSummary: [] as [string, string, string][]
};
