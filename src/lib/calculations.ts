
import { z } from "zod";
import type { AllProductsData } from "./productIngredients";

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
    for (const key in inputs) {
        numInputs[key] = Number(inputs[key]) || 0;
    }

    const productionCalculations: [string, string][] = [];

    // --- Formulas from HTML ---

    const totalRoll = Object.keys(numInputs)
        .filter(p => ["abon piramid", "abon roll pedas", "cheese roll"].includes(p))
        .reduce((sum, p) => sum + (numInputs[p] / getDivisor(p, productIngredientsData)), 0);
    productionCalculations.push(["Total Roll", `${totalRoll.toFixed(2)} loyang`]);
    
    const totalRoti = Object.keys(numInputs)
        .filter(p => ![
            "abon piramid", 
            "abon roll pedas", 
            "cheese roll", 
            "donut paha ayam",
            "Donut Almond", "Donut Coklat Ceres", "Donut Coklat Kacang", "Donut Gula Halus", "Donut Keju", "Donut Oreo",
            "7K BOMBOLONI CAPPUCINO", "7K BOMBOLONI DARK COKLAT", "7K BOMBOLONI GREENTEA", "7K BOMBOLONI TIRAMISU"
            ].includes(p))
        .reduce((sum, p) => sum + (numInputs[p] / getDivisor(p, productIngredientsData)), 0);
    productionCalculations.push(["Total Roti", `${totalRoti.toFixed(2)} loyang`]);
    
    const totalBoxTray = (
        (numInputs['donut paha ayam'] || 0) + 
        (numInputs['sosis label'] || 0) + 
        (numInputs['maxicana coklat'] || 0) +
        (numInputs['abon ayam pedas'] || 0) +
        (numInputs['red velvet cream cheese'] || 0) +
        (numInputs['abon sosis'] || 0) +
        (numInputs['cream choco cheese'] || 0) +
        (numInputs['double coklat'] || 0) +
        (numInputs['hot sosis'] || 0) +
        (numInputs['kacang merah'] || 0) +
        (numInputs['strawberry almond'] || 0) +
        (numInputs['vanilla oreo'] || 0) +
        (numInputs['abon piramid'] || 0) +
        (numInputs['abon roll pedas'] || 0) +
        (numInputs['cheese roll'] || 0) +
        (numInputs['abon taiwan'] || 0)
    );
    productionCalculations.push(["Total Box Tray", `${totalBoxTray.toFixed(2)} pcs`]);

    const totalLoyang = Object.keys(numInputs)
        .reduce((sum, p) => sum + (numInputs[p] / getDivisor(p, productIngredientsData)), 0);
    productionCalculations.push(["Total Loyang", `${totalLoyang.toFixed(2)} loyang`]);
    
    const totalSlongsong = numInputs['donut paha ayam'] || 0;
    productionCalculations.push(["Total Slongsong", `${totalSlongsong.toFixed(2)} pcs`]);

    // --- Recipes ---
    const eggCreamResep = ((
        (numInputs['abon ayam pedas'] || 0) * 18 + 
        (numInputs['abon sosis'] || 0) * 10 + 
        (numInputs['abon piramid'] || 0) * 24 + 
        (numInputs['abon roll pedas'] || 0) * 18
    ) / 22260);
    productionCalculations.push(["Egg Cream", `${eggCreamResep.toFixed(2)} resep`]);
    
    const creamCheeseResep = (((numInputs['red velvet cream cheese'] || 0) * 48) / 10000);
    productionCalculations.push(["Cream Cheese", `${creamCheeseResep.toFixed(2)} resep`]);
    
    const butterResep = ((
        (numInputs['cream choco cheese'] || 0) * 17 + 
        (numInputs['cheese roll'] || 0) * 13
    ) / 9000);
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
    
    // --- Ingredient Summary (not implemented yet) ---
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
