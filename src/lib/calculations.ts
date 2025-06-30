
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

export function calculateProductionMetrics(inputs: ProductionInputs, productIngredientsData: AllProductsData) {
    const numInputs: { [key: string]: number } = {};
    for (const key of Object.keys(inputs)) {
        numInputs[key] = Number(inputs[key]) || 0;
    }

    const productionCalculations: [string, string][] = [];

    // Dynamically calculate metrics based on product data
    for (const [productName, quantity] of Object.entries(numInputs)) {
        if (quantity > 0 && productIngredientsData[productName]?.calculation) {
            const calc = productIngredientsData[productName].calculation!;
            if (calc.divisor && calc.unit) {
                const multiplier = calc.multiplier || 1;
                const result = (quantity * multiplier) / calc.divisor;
                productionCalculations.push([productName, `${result.toFixed(2)} ${calc.unit}`]);
            }
        }
    }
    // Sort alphabetically for consistent order
    productionCalculations.sort(([a], [b]) => a.localeCompare(b));


    // These aggregate calculations are specific to the 'Roti Manis' department
    // They will remain hardcoded for now.
    const aggregateCalculations = {
        "Total Sosis": `${(((((numInputs['abon sosis'] || 0) / 2) + (numInputs['hot sosis'] || 0) + (numInputs['sosis label'] || 0)) / 10) / 28).toFixed(2)} dus`,
        "Adonan Donat": `${(((numInputs['donut paha ayam'] || 0) * 48) / 1800).toFixed(2)} resep`,
        "Adonan Roti Manis Roll": `${((((numInputs['abon piramid'] || 0) / 11) + ((numInputs['abon roll pedas'] || 0) / 12) + ((numInputs['cheese roll'] || 0) / 12)) * 800 / 2013).toFixed(2)} resep`,
        "Adonan Roti Manis Mesin": `${(((numInputs['abon ayam pedas'] || 0) + (numInputs['abon sosis'] || 0) + (numInputs['cream choco cheese'] || 0) + (numInputs['double coklat'] || 0) + (numInputs['hot sosis'] || 0) + (numInputs['kacang merah'] || 0) + (numInputs['maxicana coklat'] || 0) + (numInputs['sosis label'] || 0) + (numInputs['strawberry almond'] || 0) + (numInputs['vanilla oreo'] || 0)) * 49 / 1948).toFixed(2)} resep`,
        "Total Roll": `${((((numInputs['abon piramid'] || 0) / 11) + ((numInputs['abon roll pedas'] || 0) / 12) + ((numInputs['cheese roll'] || 0) / 12)) / 12).toFixed(2)} loyang`,
    };

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
                    ingredientTotals[ingredient].unit = data.unit; 
                }
            }
        }
    }

    const ingredientSummary = Object.entries(ingredientTotals)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([name, data]) => {
            return [name, data.amount.toFixed(2), data.unit];
        });
        
    const finalCalculations = [...productionCalculations, ...Object.entries(aggregateCalculations)];

    return {
        productionCalculations: finalCalculations,
        ingredientSummary: ingredientSummary,
    };
}

export const initialMetrics = {
    productionCalculations: [
        ["Total Sosis", "0.00 dus"],
        ["Adonan Donat", "0.00 resep"],
        ["Adonan Roti Manis Roll", "0.00 resep"],
        ["Adonan Roti Manis Mesin", "0.00 resep"],
    ],
    ingredientSummary: [] as [string, string, string][]
};
