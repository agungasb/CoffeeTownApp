
import { z } from "zod";
import type { AllProductsData } from "./productIngredients";
import { capitalize } from "./utils";

// This function creates a Zod schema dynamically based on a list of product names.
export function createProductionSchema(products: string[]) {
    const shape = products.reduce((acc, item) => {
        acc[item.toLowerCase()] = z.coerce.number().min(0).default(0);
        return acc;
    }, {} as Record<string, z.ZodType<number, any, number>>);
    return z.object(shape);
}

export type ProductionInputs = Record<string, number>;

export function calculateProductionMetrics(inputs: ProductionInputs, productIngredientsData: AllProductsData) {
    // Sanitize inputs and ensure keys are lowercase to match schema
    const numInputs: { [key: string]: number } = {};
    for (const key in inputs) {
        if (Object.prototype.hasOwnProperty.call(inputs, key)) {
            const val = inputs[key];
            numInputs[key.toLowerCase()] = (typeof val === 'number' && !isNaN(val)) ? val : 0;
        }
    }

    const productionCalculations: [string, string][] = [];

    // Helper to safely get a divisor, defaulting to 1. It also handles inconsistent casing.
    const safeGetDivisor = (productName: string): number => {
        const productKey = Object.keys(productIngredientsData).find(k => k.toLowerCase() === productName.toLowerCase());
        if (productKey) {
            const product = productIngredientsData[productKey];
            if (product && product.calculation && product.calculation.divisor && product.calculation.divisor > 0) {
                return product.calculation.divisor;
            }
        }
        return 1; // Default to 1 to prevent division by zero
    };
    
    // --- Individual Product Calculations ---
    for (const productName in numInputs) {
        const quantity = numInputs[productName];
        if (quantity > 0) {
            const productKey = Object.keys(productIngredientsData).find(k => k.toLowerCase() === productName.toLowerCase());
            if (productKey) {
                const productData = productIngredientsData[productKey];
                if (productData && productData.calculation && productData.calculation.divisor) {
                    const divisor = safeGetDivisor(productName);
                    const result = quantity / divisor;
                    const unit = productData.calculation.unit || 'loyang';
                    productionCalculations.push([capitalize(productName), `${result.toFixed(2)} ${unit}`]);
                }
            }
        }
    }

    // --- Hardcoded Total & Recipe Calculations ---
    const totalRollProducts = ["abon piramid", "abon roll pedas", "cheese roll"];
    const totalRoll = totalRollProducts.reduce((sum, p) => sum + ((numInputs[p] || 0) / safeGetDivisor(p)), 0);
    if (totalRoll > 0) productionCalculations.push(["Total Roll", `${totalRoll.toFixed(2)} loyang`]);

    const nonRotiProducts = new Set([
        "abon piramid", "abon roll pedas", "cheese roll", "donut paha ayam",
        "donut almond", "donut coklat ceres", "donut coklat kacang", "donut gula halus", "donut keju", "donut oreo",
        "7k bomboloni cappucino", "7k bomboloni dark coklat", "7k bomboloni greentea", "7k bomboloni tiramisu"
    ]);

    const totalRotiPcs = Object.keys(numInputs).reduce((sum, p) => {
        if (nonRotiProducts.has(p)) return sum;
        return sum + (numInputs[p] || 0);
    }, 0);
    if (totalRotiPcs > 0) productionCalculations.push(["Total Roti", `${totalRotiPcs.toFixed(0)} pcs`]);

    const totalBoxTrayProducts = [
        "abon ayam pedas", "red velvet cream cheese", "abon sosis", "cream choco cheese", "double coklat", 
        "hot sosis", "kacang merah", "strawberry almond", "vanilla oreo", "abon taiwan",
        "maxicana coklat", "sosis label", "donut paha ayam", ...totalRollProducts
    ];
    const totalBoxTray = totalBoxTrayProducts.reduce((sum, p) => sum + (numInputs[p] || 0), 0);
    if (totalBoxTray > 0) productionCalculations.push(["Total Box Tray", `${totalBoxTray.toFixed(0)} pcs`]);

    const totalLoyang = Object.keys(numInputs).reduce((sum, p) => {
        if ((numInputs[p] || 0) === 0) return sum;
        return sum + ((numInputs[p] || 0) / safeGetDivisor(p));
    }, 0);
    if (totalLoyang > 0) productionCalculations.push(["Total Loyang", `${totalLoyang.toFixed(2)} loyang`]);

    const totalSlongsong = numInputs['donut paha ayam'] || 0;
    if (totalSlongsong > 0) productionCalculations.push(["Total Slongsong", `${totalSlongsong.toFixed(0)} pcs`]);
    
    const totalSosisPcs = ((numInputs['abon sosis'] || 0) * 0.5) + (numInputs['hot sosis'] || 0) + (numInputs['sosis label'] || 0);
    if (totalSosisPcs > 0) {
        const totalSosisPack = totalSosisPcs / 28;
        productionCalculations.push(['Total Sosis', `${totalSosisPack.toFixed(2)} pack`]);
    }
    
    // --- Adonan Calculations by Department ---
    
    // Roti Manis Dept: Donut Paha Ayam is standalone
    const adonanPahaAyamResep = (numInputs['donut paha ayam'] || 0) / safeGetDivisor('donut paha ayam');
    if (adonanPahaAyamResep > 0) {
        productionCalculations.push(['Adonan Donut Paha Ayam', `${adonanPahaAyamResep.toFixed(2)} resep`]);
    }

    // Donut Dept: All other donuts
    const donutDeptProducts = [
        "donut almond", "donut coklat ceres", "donut coklat kacang", "donut gula halus", "donut keju", "donut oreo",
        "7k bomboloni cappucino", "7k bomboloni dark coklat", "7k bomboloni greentea", "7k bomboloni tiramisu"
    ];
    const adonanDonutDeptResep = donutDeptProducts.reduce((sum, p) => sum + ((numInputs[p] || 0) / safeGetDivisor(p)), 0);
    if (adonanDonutDeptResep > 0) {
        productionCalculations.push(['Adonan Donat', `${adonanDonutDeptResep.toFixed(2)} resep`]);
    }
    
    // Roti Manis Dept: Roll products
    const adonanRollTotalResep = totalRollProducts.reduce((sum, p) => sum + ((numInputs[p] || 0) / safeGetDivisor(p)), 0);
    if (adonanRollTotalResep > 0) {
        productionCalculations.push(['Adonan Roti Manis Roll', `${adonanRollTotalResep.toFixed(2)} resep`]);
    }
    
    // Roti Manis Dept: Machine products
    const mesinProducts = [
        "maxicana coklat", "abon ayam pedas", "red velvet cream cheese", "abon sosis", "cream choco cheese",
        "double coklat", "hot sosis", "kacang merah", "sosis label", "strawberry almond", "vanilla oreo"
    ];
    const adonanMesinTotalResep = mesinProducts.reduce((sum, p) => sum + ((numInputs[p] || 0) / safeGetDivisor(p)), 0);
    if (adonanMesinTotalResep > 0) {
        productionCalculations.push(['Adonan Roti Manis Mesin', `${adonanMesinTotalResep.toFixed(2)} resep`]);
    }

    // --- Other Hardcoded Recipe Calculations ---
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

    // Final result object
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
