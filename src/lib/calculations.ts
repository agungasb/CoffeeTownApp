
import { z } from "zod";
import { productItems } from "./products";
import type { ProductIngredients } from "./productIngredients";

export const productionSchema = z.object(
    productItems.reduce((acc, item) => {
        acc[item] = z.coerce.number().min(0).default(0);
        return acc;
    }, {} as Record<string, z.ZodType<number, any, number>>)
);

export type ProductionInputs = z.infer<typeof productionSchema>;

export function calculateProductionMetrics(inputs: ProductionInputs, productIngredientsData: ProductIngredients) {
    const numInputs: { [key: string]: number } = {};
    for (const key of Object.keys(productIngredientsData)) {
        numInputs[key] = Number(inputs[key as keyof ProductionInputs]) || 0;
    }

    const calculations = {
        "Abon Ayam Pedas": `${(numInputs['abon ayam pedas'] / 15).toFixed(2)} loyang`,
        "Abon Piramid": `${(numInputs['abon piramid'] / 11).toFixed(2)} loyang`,
        "Abon Roll Pedas": `${(numInputs['abon roll pedas'] / 12).toFixed(2)} loyang`,
        "Abon Sosis": `${(numInputs['abon sosis'] / 15).toFixed(2)} loyang`,
        "Cheese Roll": `${(numInputs['cheese roll'] / 12).toFixed(2)} loyang`,
        "Cream Choco Cheese": `${(numInputs['cream choco cheese'] / 15).toFixed(2)} loyang`,
        "Donut Paha Ayam": `${(numInputs['donut paha ayam'] / 15).toFixed(2)} loyang`,
        "Double Coklat": `${(numInputs['double coklat'] / 15).toFixed(2)} loyang`,
        "Hot Sosis": `${(numInputs['hot sosis'] / 15).toFixed(2)} loyang`,
        "Kacang Merah": `${(numInputs['kacang merah'] / 15).toFixed(2)} loyang`,
        "Maxicana Coklat": `${(numInputs['maxicana coklat'] / 15).toFixed(2)} loyang`,
        "Red Velvet Cream Cheese": `${(numInputs['red velvet cream cheese'] / 15).toFixed(2)} loyang`,
        "Sosis Label": `${(numInputs['sosis label'] / 12).toFixed(2)} loyang`,
        "Strawberry Almond": `${(numInputs['strawberry almond'] / 15).toFixed(2)} loyang`,
        "Vanilla Oreo": `${(numInputs['vanilla oreo'] / 15).toFixed(2)} loyang`,
        "Abon Taiwan": `${((numInputs['abon taiwan'] * 2) / 15).toFixed(2)} loyang`,
        "Total Sosis": `${((((numInputs['abon sosis'] / 2) + numInputs['hot sosis'] + numInputs['sosis label']) / 10) / 28).toFixed(2)} dus`,
        "Adonan Donat": `${((numInputs['donut paha ayam'] * 48) / 1800).toFixed(2)} resep`,
        "Adonan Roti Manis Roll": `${(((numInputs['abon piramid'] / 11) + (numInputs['abon roll pedas'] / 12) + (numInputs['cheese roll'] / 12)) * 800 / 2013).toFixed(2)} resep`,
        "Adonan Roti Manis Mesin": `${((numInputs['abon ayam pedas'] + numInputs['abon sosis'] + numInputs['cream choco cheese'] + numInputs['double coklat'] + numInputs['hot sosis'] + numInputs['kacang merah'] + numInputs['maxicana coklat'] + numInputs['sosis label'] + numInputs['strawberry almond'] + numInputs['vanilla oreo']) * 49 / 1948).toFixed(2)} resep`,
        "Total Roll": `${(((numInputs['abon piramid'] / 11) + (numInputs['abon roll pedas'] / 12) + (numInputs['cheese roll'] / 12)) / 12).toFixed(2)} loyang`,
        "Total Roti": `${Object.values(numInputs).reduce((acc, curr) => acc + curr, 0).toFixed(2)} pcs`,
        "Total Box Container": `${((numInputs['abon ayam pedas'] / 15) + (numInputs['abon piramid'] / 20) + (numInputs['abon roll pedas'] / 25) + (numInputs['abon sosis'] / 15) + (numInputs['cheese roll'] / 35) + (numInputs['cream choco cheese'] / 12) + (numInputs['donut paha ayam'] / 15) + (numInputs['double coklat'] / 15) + (numInputs['hot sosis'] / 15) + (numInputs['kacang merah'] / 15) + (numInputs['maxicana coklat'] / 15) + (numInputs['red velvet cream cheese'] / 15) + (numInputs['sosis label'] / 15) + (numInputs['strawberry almond'] / 15) + (numInputs['vanilla oreo'] / 15) + (numInputs['abon taiwan'] / 15)).toFixed(2)} pcs`,
        "Total Loyang": `${((numInputs['abon ayam pedas'] / 15) + (numInputs['abon piramid'] / 11) + (numInputs['abon roll pedas'] / 12) + (numInputs['abon sosis'] / 15) + (numInputs['cheese roll'] / 12) + (numInputs['cream choco cheese'] / 15) + (numInputs['donut paha ayam'] / 15) + (numInputs['double coklat'] / 15) + (numInputs['hot sosis'] / 15) + (numInputs['kacang merah'] / 15) + (numInputs['maxicana coklat'] / 15) + (numInputs['red velvet cream cheese'] / 15) + (numInputs['sosis label'] / 12) + (numInputs['strawberry almond'] / 15) + (numInputs['vanilla oreo'] / 15) + (numInputs['abon taiwan'] / 15)).toFixed(2)} pcs`,
        "Total Slongsong": `${(((numInputs['abon ayam pedas'] + numInputs['cream choco cheese'] + numInputs['double coklat'] + numInputs['hot sosis'] + numInputs['strawberry almond']) / 15) / 15).toFixed(2)} trolley`,
        "Adonan Manual": `${(((numInputs['abon sosis'] + numInputs['kacang merah'] + numInputs['sosis label']) / 15) / 7).toFixed(2)} loyang`,
        "Egg Cream": `${((numInputs['abon ayam pedas'] * 18 + numInputs['abon sosis'] * 10 + numInputs['abon piramid'] * 24 + numInputs['abon roll pedas'] * 18) / 22260).toFixed(2)} resep`,
        "Cream Cheese": `${((numInputs['red velvet cream cheese'] * 48) / 10000).toFixed(2)} resep`,
        "Butter": `${((numInputs['cream choco cheese'] * 17 + numInputs['cheese roll'] * 13) / 9000).toFixed(2)} resep`,
        "Butter Donat": `${((numInputs['donut paha ayam'] * 12) / 10000).toFixed(2)} resep`,
        "Coklat Ganache": `${((numInputs['double coklat'] * 17) / 6000).toFixed(2)} resep`,
        "Topping Maxicana": `${((numInputs['maxicana coklat'] * 10) / 13100).toFixed(2)} resep`,
        "Fla Abon Taiwan": `${((numInputs['abon taiwan'] * 30) / 328).toFixed(2)} resep`,
        "Adonan Abon Taiwan": `${(numInputs['abon taiwan'] / 4).toFixed(2)} resep`,
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
    ["Total Roll", "0.00 loyang"],
    ["Total Roti", "0.00 pcs"],
    ["Total Box Container", "0.00 pcs"],
    ["Total Loyang", "0.00 pcs"],
    ["Total Slongsong", "0.00 trolley"],
    ["Adonan Manual", "0.00 loyang"],
    ["Egg Cream", "0.00 resep"],
    ["Cream Cheese", "0.00 resep"],
    ["Butter", "0.00 resep"],
    ["Butter Donat", "0.00 resep"],
    ["Coklat Ganache", "0.00 resep"],
    ["Topping Maxicana", "0.00 resep"],
    ["Fla Abon Taiwan", "0.00 resep"],
    ["Adonan Abon Taiwan", "0.00 resep"],
];

export const initialMetrics = {
    productionCalculations,
    ingredientSummary: [] as [string, string, string][]
};
