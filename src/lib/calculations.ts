
import { z } from "zod";
import type { ProductIngredients } from "./productIngredients";

// This function creates a Zod schema dynamically based on a list of product names.
export function createProductionSchema(products: string[]) {
    const shape = products.reduce((acc, item) => {
        acc[item] = z.coerce.number().min(0).default(0);
        return acc;
    }, {} as Record<string, z.ZodType<number, any, number>>);
    return z.object(shape);
}

export type ProductionInputs = Record<string, number>;

export function calculateProductionMetrics(inputs: ProductionInputs, productIngredientsData: ProductIngredients) {
    const numInputs: { [key: string]: number } = {};
    for (const key of Object.keys(inputs)) {
        numInputs[key] = Number(inputs[key]) || 0;
    }

    // These calculations are specific to the 'Roti Manis' department
    // They will default to 0 if the products don't exist in the current `inputs`.
    const calculations = {
        "Abon Ayam Pedas": `${(numInputs['abon ayam pedas'] / 15 || 0).toFixed(2)} loyang`,
        "Abon Piramid": `${(numInputs['abon piramid'] / 11 || 0).toFixed(2)} loyang`,
        "Abon Roll Pedas": `${(numInputs['abon roll pedas'] / 12 || 0).toFixed(2)} loyang`,
        "Abon Sosis": `${(numInputs['abon sosis'] / 15 || 0).toFixed(2)} loyang`,
        "Cheese Roll": `${(numInputs['cheese roll'] / 12 || 0).toFixed(2)} loyang`,
        "Cream Choco Cheese": `${(numInputs['cream choco cheese'] / 15 || 0).toFixed(2)} loyang`,
        "Donut Paha Ayam": `${(numInputs['donut paha ayam'] / 15 || 0).toFixed(2)} loyang`,
        "Double Coklat": `${(numInputs['double coklat'] / 15 || 0).toFixed(2)} loyang`,
        "Hot Sosis": `${(numInputs['hot sosis'] / 15 || 0).toFixed(2)} loyang`,
        "Kacang Merah": `${(numInputs['kacang merah'] / 15 || 0).toFixed(2)} loyang`,
        "Maxicana Coklat": `${(numInputs['maxicana coklat'] / 15 || 0).toFixed(2)} loyang`,
        "Red Velvet Cream Cheese": `${(numInputs['red velvet cream cheese'] / 15 || 0).toFixed(2)} loyang`,
        "Sosis Label": `${(numInputs['sosis label'] / 12 || 0).toFixed(2)} loyang`,
        "Strawberry Almond": `${(numInputs['strawberry almond'] / 15 || 0).toFixed(2)} loyang`,
        "Vanilla Oreo": `${(numInputs['vanilla oreo'] / 15 || 0).toFixed(2)} loyang`,
        "Abon Taiwan": `${(((numInputs['abon taiwan'] || 0) * 2) / 15).toFixed(2)} loyang`,
        "Total Sosis": `${(((((numInputs['abon sosis'] || 0) / 2) + (numInputs['hot sosis'] || 0) + (numInputs['sosis label'] || 0)) / 10) / 28).toFixed(2)} dus`,
        "Adonan Donat": `${(((numInputs['donut paha ayam'] || 0) * 48) / 1800).toFixed(2)} resep`,
        "Adonan Roti Manis Roll": `${((((numInputs['abon piramid'] || 0) / 11) + ((numInputs['abon roll pedas'] || 0) / 12) + ((numInputs['cheese roll'] || 0) / 12)) * 800 / 2013).toFixed(2)} resep`,
        "Adonan Roti Manis Mesin": `${(((numInputs['abon ayam pedas'] || 0) + (numInputs['abon sosis'] || 0) + (numInputs['cream choco cheese'] || 0) + (numInputs['double coklat'] || 0) + (numInputs['hot sosis'] || 0) + (numInputs['kacang merah'] || 0) + (numInputs['maxicana coklat'] || 0) + (numInputs['sosis label'] || 0) + (numInputs['strawberry almond'] || 0) + (numInputs['vanilla oreo'] || 0)) * 49 / 1948).toFixed(2)} resep`,
    };

    const ingredientTotals: Record<string, { amount: number, unit: string }> = {};

    for (const [productName, quantity] of Object.entries(numInputs)) {
        const productKey = productName as keyof typeof productIngredientsData;
        if (quantity > 0 && productIngredientsData[productKey]) {
            const ingredients = productIngredientsData[productKey];
            for (const [ingredient, data] of Object.entries(ingredients)) {
                if (!ingredientTotals[ingredient]) {
                    ingredientTotals[ingredient] = { amount: 0, unit: data.unit };
                }
                ingredientTotals[ingredient].amount += data.amount * quantity;
                ingredientTotals[ingredient].unit = data.unit; 
            }
        }
    }

    const ingredientSummary = Object.entries(ingredientTotals)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([name, data]) => {
            return [name, data.amount.toFixed(2), data.unit];
        });

    return {
        productionCalculations: Object.entries(calculations),
        ingredientSummary: ingredientSummary,
    };
}

const productionCalculations = [
    ["Abon Ayam Pedas", "0.00 loyang"],
    ["Abon Piramid", "0.00 loyang"],
    ["Abon Roll Pedas", "0.00 loyang"],
    ["Abon Sosis", "0.00 loyang"],
    ["Cheese Roll", "0.00 loyang"],
    ["Cream Choco Cheese", "0.00 loyang"],
    ["Donut Paha Ayam", "0.00 loyang"],
    ["Double Coklat", "0.00 loyang"],
    ["Hot Sosis", "0.00 loyang"],
    ["Kacang Merah", "0.00 loyang"],
    ["Maxicana Coklat", "0.00 loyang"],
    ["Red Velvet Cream Cheese", "0.00 loyang"],
    ["Sosis Label", "0.00 loyang"],
    ["Strawberry Almond", "0.00 loyang"],
    ["Vanilla Oreo", "0.00 loyang"],
    ["Abon Taiwan", "0.00 loyang"],
    ["Total Sosis", "0.00 dus"],
    ["Adonan Donat", "0.00 resep"],
    ["Adonan Roti Manis Roll", "0.00 resep"],
    ["Adonan Roti Manis Mesin", "0.00 resep"],
];

export const initialMetrics = {
    productionCalculations,
    ingredientSummary: [] as [string, string, string][]
};
