
import { z } from "zod";
import type { AllProductsData } from "./productIngredients";
import { capitalize } from "./utils";

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
    // Sanitize inputs to ensure they are always numbers, defaulting to 0 to prevent NaN errors.
    const numInputs: { [key: string]: number } = {};
    for (const key of Object.keys(inputs)) {
        const val = inputs[key];
        numInputs[key] = (typeof val === 'number' && !isNaN(val)) ? val : 0;
    }

    const productionCalculations: [string, string][] = [];

    // --- Individual Product Calculations ---
    // This loops through every product input and calculates its specific loyang value.
    for (const productName in numInputs) {
        const quantity = numInputs[productName];
        if (quantity > 0) {
            const productData = productIngredientsData[productName];
            if (productData && productData.calculation && productData.calculation.divisor) {
                const result = quantity / productData.calculation.divisor;
                const unit = productData.calculation.unit || 'loyang'; // Default to 'loyang' if not specified
                productionCalculations.push([capitalize(productName), `${result.toFixed(2)} ${unit}`]);
            }
        }
    }


    // Helper to safely get a divisor, defaulting to 1 to prevent division by zero.
    const safeGetDivisor = (productName: string): number => {
        const product = productIngredientsData[productName];
        if (product && product.calculation && product.calculation.divisor && product.calculation.divisor > 0) {
            return product.calculation.divisor;
        }
        return 1;
    };

    // --- Hardcoded Total & Recipe Calculations ---
    const totalRollProducts = ["abon piramid", "abon roll pedas", "cheese roll"];
    const totalRoll = totalRollProducts.reduce((sum, p) => {
        const quantity = numInputs[p] || 0;
        return sum + (quantity / safeGetDivisor(p));
    }, 0);
    productionCalculations.push(["Total Roll", `${totalRoll.toFixed(2)} loyang`]);

    const nonRotiProducts = new Set([
        "abon piramid", "abon roll pedas", "cheese roll", "donut paha ayam",
        "Donut Almond", "Donut Coklat Ceres", "Donut Coklat Kacang", "Donut Gula Halus", "Donut Keju", "Donut Oreo",
        "7K BOMBOLONI CAPPUCINO", "7K BOMBOLONI DARK COKLAT", "7K BOMBOLONI GREENTEA", "7K BOMBOLONI TIRAMISU"
    ]);

    const totalRoti = Object.keys(numInputs).reduce((sum, p) => {
        if (nonRotiProducts.has(p)) {
            return sum;
        }
        const quantity = numInputs[p] || 0;
        return sum + (quantity / safeGetDivisor(p));
    }, 0);
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

    const totalLoyang = Object.keys(numInputs).reduce((sum, p) => {
        const quantity = numInputs[p] || 0;
        return sum + (quantity / safeGetDivisor(p));
    }, 0);
    productionCalculations.push(["Total Loyang", `${totalLoyang.toFixed(2)} loyang`]);

    const totalSlongsong = numInputs['donut paha ayam'] || 0;
    productionCalculations.push(["Total Slongsong", `${totalSlongsong.toFixed(2)} pcs`]);

    const eggCreamResep = ((
        (numInputs['abon ayam pedas'] || 0) * 18 +
        (numInputs['abon sosis'] || 0) * 10 +
        (numInputs['abon piramid'] || 0) * 24 +
        (numInputs['abon roll pedas'] || 0) * 18
    ) / 22260);
    if (eggCreamResep > 0) productionCalculations.push(["Egg Cream", `${eggCreamResep.toFixed(2)} resep`]);

    const creamCheeseResep = (((numInputs['red velvet cream cheese'] || 0) * 48) / 10000);
    if (creamCheeseResep > 0) productionCalculations.push(["Cream Cheese", `${creamCheeseResep.toFixed(2)} resep`]);

    const butterResep = ((
        (numInputs['cream choco cheese'] || 0) * 17 +
        (numInputs['cheese roll'] || 0) * 13
    ) / 9000);
    if (butterResep > 0) productionCalculations.push(["Butter", `${butterResep.toFixed(2)} resep`]);

    const butterDonatResep = (((numInputs['donut paha ayam'] || 0) * 12) / 10000);
    if (butterDonatResep > 0) productionCalculations.push(["Butter Donat", `${butterDonatResep.toFixed(2)} resep`]);

    const coklatGanacheResep = (((numInputs['double coklat'] || 0) * 17) / 6000);
    if (coklatGanacheResep > 0) productionCalculations.push(["Coklat Ganache", `${coklatGanacheResep.toFixed(2)} resep`]);

    const toppingMaxicanaResep = (((numInputs['maxicana coklat'] || 0) * 10) / 13100);
    if (toppingMaxicanaResep > 0) productionCalculations.push(["Topping Maxicana", `${toppingMaxicanaResep.toFixed(2)} resep`]);

    const flaAbonTaiwanResep = (((numInputs['abon taiwan'] || 0) * 30) / 328);
    if (flaAbonTaiwanResep > 0) productionCalculations.push(["Fla Abon Taiwan", `${flaAbonTaiwanResep.toFixed(2)} resep`]);

    const adonanAbonTaiwanResep = ((numInputs['abon taiwan'] || 0) / 4);
    if (adonanAbonTaiwanResep > 0) productionCalculations.push(["Adonan Abon Taiwan", `${adonanAbonTaiwanResep.toFixed(2)} resep (*kali 2 telur)`]);

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
