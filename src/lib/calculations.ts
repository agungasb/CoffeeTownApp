import { z } from "zod";
import { productItems } from "./products";

export const productionSchema = z.object(
    productItems.reduce((acc, item) => {
        acc[item] = z.coerce.number().min(0).default(0);
        return acc;
    }, {} as Record<string, z.ZodType<number, any, number>>)
);

export type ProductionInputs = z.infer<typeof productionSchema>;

export function calculateProductionMetrics(inputs: ProductionInputs) {
    const calculations = {
        "Abon Ayam Pedas": `${(inputs['abon ayam pedas'] / 15).toFixed(2)} loyang`,
        "Abon Piramid": `${(inputs['abon piramid'] / 11).toFixed(2)} loyang`,
        "Abon Roll Pedas": `${(inputs['abon roll pedas'] / 12).toFixed(2)} loyang`,
        "Abon Sosis": `${(inputs['abon sosis'] / 15).toFixed(2)} loyang`,
        "Cheese Roll": `${(inputs['cheese roll'] / 12).toFixed(2)} loyang`,
        "Cream Choco Cheese": `${(inputs['cream choco cheese'] / 15).toFixed(2)} loyang`,
        "Donut Paha Ayam": `${(inputs['donut paha ayam'] / 15).toFixed(2)} loyang`,
        "Double Coklat": `${(inputs['double coklat'] / 15).toFixed(2)} loyang`,
        "Hot Sosis": `${(inputs['hot sosis'] / 15).toFixed(2)} loyang`,
        "Kacang Merah": `${(inputs['kacang merah'] / 15).toFixed(2)} loyang`,
        "Maxicana Coklat": `${(inputs['maxicana coklat'] / 15).toFixed(2)} loyang`,
        "Red Velvet Cream Cheese": `${(inputs['red velvet cream cheese'] / 15).toFixed(2)} loyang`,
        "Sosis Label": `${(inputs['sosis label'] / 12).toFixed(2)} loyang`,
        "Strawberry Almond": `${(inputs['strawberry almond'] / 15).toFixed(2)} loyang`,
        "Vanilla Oreo": `${(inputs['vanilla oreo'] / 15).toFixed(2)} loyang`,
        "Abon Taiwan": `${((inputs['abon taiwan'] * 2) / 15).toFixed(2)} loyang`,
        "Total Sosis": `${((((inputs['abon sosis'] / 2) + inputs['hot sosis'] + inputs['sosis label']) / 10) / 28).toFixed(2)} dus`,
        "Adonan Donat": `${((inputs['donut paha ayam'] * 48) / 1800).toFixed(2)} resep`,
        "Adonan Roti Manis Roll": `${(((inputs['abon piramid'] / 11) + (inputs['abon roll pedas'] / 12) + (inputs['cheese roll'] / 12)) * 800 / 2013).toFixed(2)} resep`,
        "Adonan Roti Manis Mesin": `${((inputs['abon ayam pedas'] + inputs['abon sosis'] + inputs['cream choco cheese'] + inputs['double coklat'] + inputs['hot sosis'] + inputs['kacang merah'] + inputs['maxicana coklat'] + inputs['sosis label'] + inputs['strawberry almond'] + inputs['vanilla oreo']) * 49 / 1948).toFixed(2)} resep`,
        "Total Roll": `${(((inputs['abon piramid'] / 11) + (inputs['abon roll pedas'] / 12) + (inputs['cheese roll'] / 12)) / 12).toFixed(2)} loyang`,
        "Total Roti": `${Object.values(inputs).reduce((acc, curr) => acc + curr, 0).toFixed(2)} pcs`,
        "Total Box Container": `${((inputs['abon ayam pedas'] / 15) + (inputs['abon piramid'] / 20) + (inputs['abon roll pedas'] / 25) + (inputs['abon sosis'] / 15) + (inputs['cheese roll'] / 35) + (inputs['cream choco cheese'] / 12) + (inputs['donut paha ayam'] / 15) + (inputs['double coklat'] / 15) + (inputs['hot sosis'] / 15) + (inputs['kacang merah'] / 15) + (inputs['maxicana coklat'] / 15) + (inputs['red velvet cream cheese'] / 15) + (inputs['sosis label'] / 15) + (inputs['strawberry almond'] / 15) + (inputs['vanilla oreo'] / 15) + (inputs['abon taiwan'] / 15)).toFixed(2)} pcs`,
        "Total Loyang": `${((inputs['abon ayam pedas'] / 15) + (inputs['abon piramid'] / 11) + (inputs['abon roll pedas'] / 12) + (inputs['abon sosis'] / 15) + (inputs['cheese roll'] / 12) + (inputs['cream choco cheese'] / 15) + (inputs['donut paha ayam'] / 15) + (inputs['double coklat'] / 15) + (inputs['hot sosis'] / 15) + (inputs['kacang merah'] / 15) + (inputs['maxicana coklat'] / 15) + (inputs['red velvet cream cheese'] / 15) + (inputs['sosis label'] / 12) + (inputs['strawberry almond'] / 15) + (inputs['vanilla oreo'] / 15) + (inputs['abon taiwan'] / 15)).toFixed(2)} pcs`,
        "Total Slongsong": `${(((inputs['abon ayam pedas'] + inputs['cream choco cheese'] + inputs['double coklat'] + inputs['hot sosis'] + inputs['strawberry almond']) / 15) / 15).toFixed(2)} trolley`,
        "Adonan Manual": `${(((inputs['abon sosis'] + inputs['kacang merah'] + inputs['sosis label']) / 15) / 7).toFixed(2)} loyang`,
        "Egg Cream": `${((inputs['abon ayam pedas'] * 18 + inputs['abon sosis'] * 10 + inputs['abon piramid'] * 24 + inputs['abon roll pedas'] * 18) / 22260).toFixed(2)} resep`,
        "Cream Cheese": `${((inputs['red velvet cream cheese'] * 48) / 10000).toFixed(2)} resep`,
        "Butter": `${((inputs['cream choco cheese'] * 17 + inputs['cheese roll'] * 13) / 9000).toFixed(2)} resep`,
        "Butter Donat": `${((inputs['donut paha ayam'] * 12) / 10000).toFixed(2)} resep`,
        "Coklat Ganache": `${((inputs['double coklat'] * 17) / 6000).toFixed(2)} resep`,
        "Topping Maxicana": `${((inputs['maxicana coklat'] * 10) / 13100).toFixed(2)} resep`,
        "Fla Abon Taiwan": `${((inputs['abon taiwan'] * 30) / 328).toFixed(2)} resep`,
        "Adonan Abon Taiwan": `${(inputs['abon taiwan'] / 4).toFixed(2)} resep`,
    };

    return Object.entries(calculations);
}

export const initialCalculations = [
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
