
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

    const getDivisor = (productName: string, fallback: number): number => {
        return productIngredientsData[productName]?.calculation?.divisor || fallback;
    };
    
    const totalRollValue = (
        ( (numInputs['abon piramid'] || 0) / getDivisor('abon piramid', 11) ) +
        ( (numInputs['abon roll pedas'] || 0) / getDivisor('abon roll pedas', 12) ) +
        ( (numInputs['cheese roll'] || 0) / getDivisor('cheese roll', 12) )
    ) / 12;

    const totalRoti = Object.values(numInputs).reduce((sum, current) => sum + (current || 0), 0);

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


    const productionCalculations: [string, string][] = [];

    productionCalculations.push(["Total Roll", `${totalRollValue.toFixed(2)} loyang`]);
    productionCalculations.push(["Total Roti", `${totalRoti.toFixed(0)} pcs`]);
    productionCalculations.push(["Total Box Tray", `${totalBoxTray.toFixed(2)} pcs`]);
    productionCalculations.push(["Total Loyang", `${totalLoyang.toFixed(2)} pcs`]);


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

    return {
        productionCalculations: productionCalculations,
        ingredientSummary: ingredientSummary,
    };
}

export const initialMetrics = {
    productionCalculations: [] as [string, string][],
    ingredientSummary: [] as [string, string, string][]
};
