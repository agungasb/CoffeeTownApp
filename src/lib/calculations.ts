
import { z } from "zod";
import type { AllProductsData, ProductData } from "./productIngredients";
import type { Recipe } from "./recipes";
import { capitalize } from "./utils";

export function createProductionSchema(products: string[]) {
    const shape = products.reduce((acc, item) => {
        acc[item] = z.coerce.number().min(0).default(0);
        return acc;
    }, {} as Record<string, z.ZodType<number, any, number>>);
    return z.object(shape);
}

export type ProductionInputs = Record<string, number>;

// Helper to find a product in productIngredientsData, ignoring case.
const findProductData = (productName: string, allProducts: AllProductsData): ProductData | null => {
    const key = Object.keys(allProducts).find(k => k.toLowerCase() === productName.toLowerCase());
    return key ? allProducts[key] : null;
};

// Helper to find a recipe in recipes array, ignoring case.
const findRecipe = (recipeName: string, allRecipes: Recipe[]): Recipe | null => {
    return allRecipes.find(r => r.name.toLowerCase() === recipeName.toLowerCase()) || null;
}

// Helper to get recipe base weight
const getRecipeBaseWeight = (recipeName: string, allRecipes: Recipe[]): number => {
    const recipe = findRecipe(recipeName, allRecipes);
    if (!recipe) return 0;
    return recipe.ingredients.reduce((sum, ing) => sum + ing.amount, 0);
};

export function calculateProductionMetrics(inputs: ProductionInputs, productIngredientsData: AllProductsData, allRecipes: Recipe[]) {
    const numInputs: { [key: string]: number } = {};
    for (const key in inputs) {
        if (Object.prototype.hasOwnProperty.call(inputs, key)) {
            const val = inputs[key];
            numInputs[key.toLowerCase()] = (typeof val === 'number' && !isNaN(val)) ? val : 0;
        }
    }

    const productionCalculations: [string, string][] = [];
    const ingredientSummaryMap: { [key: string]: { amount: number; unit: string } } = {};

    // --- Individual Product Calculations (input / divisor) ---
    for (const productName in numInputs) {
        const quantity = numInputs[productName];
        if (quantity > 0) {
            const productData = findProductData(productName, productIngredientsData);
            if (productData?.calculation?.divisor && productData.calculation.divisor > 0) {
                const result = quantity / productData.calculation.divisor;
                const unit = productData.calculation.unit || 'loyang';
                productionCalculations.push([capitalize(productName), `${result.toFixed(2)} ${unit}`]);
            }
        }
    }

    // --- Hardcoded Total & Combined Calculations ---
    const safeGetDivisor = (productName: string): number => {
        const productData = findProductData(productName, productIngredientsData);
        return productData?.calculation?.divisor || 1;
    };
    
    const totalRollProducts = ["abon piramid", "abon roll pedas", "cheese roll"];
    const totalRoll = totalRollProducts.reduce((sum, p) => sum + (numInputs[p.toLowerCase()] || 0) / safeGetDivisor(p), 0);
    if (totalRoll > 0) productionCalculations.push(["Total Roll", `${totalRoll.toFixed(2)} loyang`]);

    const nonRotiProducts = new Set(["abon piramid", "abon roll pedas", "cheese roll", "donut paha ayam", "donut almond", "donut coklat ceres", "donut coklat kacang", "donut gula halus", "donut keju", "donut oreo", "7k bomboloni cappucino", "7k bomboloni dark coklat", "7k bomboloni greentea", "7k bomboloni tiramisu"]);
    const totalRotiPcs = Object.keys(numInputs).reduce((sum, p) => {
        if (nonRotiProducts.has(p.toLowerCase())) return sum;
        return sum + (numInputs[p.toLowerCase()] || 0);
    }, 0);
    if (totalRotiPcs > 0) productionCalculations.push(["Total Roti", `${totalRotiPcs.toFixed(0)} pcs`]);

    const totalBoxTray = Object.keys(numInputs).reduce((sum, p) => sum + (numInputs[p.toLowerCase()] || 0), 0);
    if (totalBoxTray > 0) productionCalculations.push(["Total Box Tray", `${totalBoxTray.toFixed(0)} pcs`]);

    const totalLoyang = Object.keys(numInputs).reduce((sum, p) => sum + ((numInputs[p.toLowerCase()] || 0) / safeGetDivisor(p)), 0);
    if (totalLoyang > 0) productionCalculations.push(["Total Loyang", `${totalLoyang.toFixed(2)} loyang`]);
    
    const totalSlongsong = numInputs['donut paha ayam'] || 0;
    if (totalSlongsong > 0) productionCalculations.push(["Total Slongsong", `${totalSlongsong.toFixed(0)} pcs`]);

    const totalSosisPcs = ((numInputs['abon sosis'] || 0) * 0.5) + (numInputs['hot sosis'] || 0) + (numInputs['sosis label'] || 0);
    if (totalSosisPcs > 0) {
        const totalSosisPack = totalSosisPcs / 28;
        productionCalculations.push(['Total Sosis', `${totalSosisPack.toFixed(2)} pack`]);
    }

    // --- Recipe Calculations (Your Formula) ---
    const calculateRecipeNeeded = (productNames: string[], recipeIngredientName: string, recipeName: string): number => {
        const recipeBaseWeight = getRecipeBaseWeight(recipeName, allRecipes);
        if (recipeBaseWeight === 0) return 0;

        return productNames.reduce((totalRecipes, productName) => {
            const productInput = numInputs[productName.toLowerCase()] || 0;
            if (productInput === 0) return totalRecipes;

            const productData = findProductData(productName, productIngredientsData);
            const doughWeightPerPiece = productData?.ingredients[recipeIngredientName]?.amount || 0;
            
            if (doughWeightPerPiece > 0) {
                const recipesForProduct = (productInput * doughWeightPerPiece) / recipeBaseWeight;
                return totalRecipes + recipesForProduct;
            }
            return totalRecipes;
        }, 0);
    };

    const adonanPahaAyamResep = calculateRecipeNeeded(['donut paha ayam'], 'Adonan Donut Paha Ayam', 'Adonan Donut Paha Ayam');
    if (adonanPahaAyamResep > 0) productionCalculations.push(['Adonan Donut Paha Ayam', `${adonanPahaAyamResep.toFixed(2)} resep`]);
    
    const donutDeptProducts = ["Donut Almond", "Donut Coklat Ceres", "Donut Coklat Kacang", "Donut Gula Halus", "Donut Keju", "Donut Oreo", "7K BOMBOLONI CAPPUCINO", "7K BOMBOLONI DARK COKLAT", "7K BOMBOLONI GREENTEA", "7K BOMBOLONI TIRAMISU"];
    const adonanDonutDeptResep = calculateRecipeNeeded(donutDeptProducts, 'Adonan Donat Joko', 'Adonan Donat Joko');
    if (adonanDonutDeptResep > 0) productionCalculations.push(['Adonan Donat', `${adonanDonutDeptResep.toFixed(2)} resep`]);

    const adonanRollTotalResep = calculateRecipeNeeded(totalRollProducts, 'Adonan Roti Manis Roll', 'Adonan Roti Manis Roll');
    if (adonanRollTotalResep > 0) productionCalculations.push(['Adonan Roti Manis Roll', `${adonanRollTotalResep.toFixed(2)} resep`]);

    const mesinProducts = ["maxicana coklat", "abon ayam pedas", "red velvet cream cheese", "abon sosis", "cream choco cheese", "double coklat", "hot sosis", "kacang merah", "sosis label", "strawberry almond", "vanilla oreo"];
    const adonanMesinTotalResep = calculateRecipeNeeded(mesinProducts, 'Adonan Roti Manis Mesin', 'Adonan Roti Manis Mesin');
    if (adonanMesinTotalResep > 0) productionCalculations.push(['Adonan Roti Manis Mesin', `${adonanMesinTotalResep.toFixed(2)} resep`]);
    
    // --- Other Hardcoded Recipe Calculations ---
    const eggCreamResep = ((numInputs['abon ayam pedas'] || 0) * 18 + (numInputs['abon sosis'] || 0) * 10 + (numInputs['abon piramid'] || 0) * 24 + (numInputs['abon roll pedas'] || 0) * 18) / 22260;
    if (eggCreamResep > 0) productionCalculations.push(["Egg Cream", `${eggCreamResep.toFixed(2)} resep`]);

    const creamCheeseResep = ((numInputs['red velvet cream cheese'] || 0) * 48) / 10000;
    if (creamCheeseResep > 0) productionCalculations.push(["Cream Cheese", `${creamCheeseResep.toFixed(2)} resep`]);

    const butterResep = ((numInputs['cream choco cheese'] || 0) * 17 + (numInputs['cheese roll'] || 0) * 13) / 9000;
    if (butterResep > 0) productionCalculations.push(["Butter", `${butterResep.toFixed(2)} resep`]);

    const butterDonatResep = ((numInputs['donut paha ayam'] || 0) * 12) / 10000;
    if (butterDonatResep > 0) productionCalculations.push(["Butter Donat", `${butterDonatResep.toFixed(2)} resep`]);

    const coklatGanacheResep = ((numInputs['double coklat'] || 0) * 17) / 6000;
    if (coklatGanacheResep > 0) productionCalculations.push(["Coklat Ganache", `${coklatGanacheResep.toFixed(2)} resep`]);

    const toppingMaxicanaResep = ((numInputs['maxicana coklat'] || 0) * 10) / 13100;
    if (toppingMaxicanaResep > 0) productionCalculations.push(["Topping Maxicana", `${toppingMaxicanaResep.toFixed(2)} resep`]);

    const flaAbonTaiwanResep = ((numInputs['abon taiwan'] || 0) * 30) / 328;
    if (flaAbonTaiwanResep > 0) productionCalculations.push(["Fla Abon Taiwan", `${flaAbonTaiwanResep.toFixed(2)} resep`]);

    const adonanAbonTaiwanResep = (numInputs['abon taiwan'] || 0) / 4;
    if (adonanAbonTaiwanResep > 0) productionCalculations.push(["Adonan Abon Taiwan", `${adonanAbonTaiwanResep.toFixed(2)} resep (*kali 2 telur)`]);

    // --- Ingredient Summary Calculation ---
    const allRecipeCalcs = {
      "Adonan Donut Paha Ayam": adonanPahaAyamResep,
      "Adonan Donat Joko": adonanDonutDeptResep,
      "Adonan Roti Manis Roll": adonanRollTotalResep,
      "Adonan Roti Manis Mesin": adonanMesinTotalResep,
      "Egg Cream": eggCreamResep,
      "Cream Cheese": creamCheeseResep,
      "Butter": butterResep,
      "Butter Donat": butterDonatResep,
      "Coklat Ganache": coklatGanacheResep,
      "Topping Maxicana": toppingMaxicanaResep,
      "Fla Abon Taiwan": flaAbonTaiwanResep,
      "Adonan Abon Taiwan": adonanAbonTaiwanResep,
    };

    for (const [recipeName, recipeMultiplier] of Object.entries(allRecipeCalcs)) {
        if (recipeMultiplier > 0) {
            const recipe = findRecipe(recipeName, allRecipes);
            if (recipe) {
                recipe.ingredients.forEach(ing => {
                    const totalAmount = ing.amount * recipeMultiplier;
                    if (!ingredientSummaryMap[ing.name]) {
                        ingredientSummaryMap[ing.name] = { amount: 0, unit: ing.unit };
                    }
                    ingredientSummaryMap[ing.name].amount += totalAmount;
                });
            }
        }
    }
    
    // Add non-recipe ingredients from products
     for (const productName in numInputs) {
        const quantity = numInputs[productName];
        if (quantity > 0) {
            const productData = findProductData(productName, productIngredientsData);
            if (productData) {
                for (const ingName in productData.ingredients) {
                    // Check if it's a raw material, not a base recipe
                    if (!findRecipe(ingName, allRecipes)) {
                        const ingData = productData.ingredients[ingName];
                        const totalAmount = ingData.amount * quantity;
                         if (!ingredientSummaryMap[ingName]) {
                            ingredientSummaryMap[ingName] = { amount: 0, unit: ingData.unit };
                        }
                        ingredientSummaryMap[ingName].amount += totalAmount;
                    }
                }
            }
        }
    }


    const ingredientSummary = Object.entries(ingredientSummaryMap)
        .map(([name, { amount, unit }]) => [capitalize(name), amount.toFixed(2), unit] as [string, string, string])
        .sort((a, b) => a[0].localeCompare(b[0]));
        
    return {
        productionCalculations,
        ingredientSummary,
    };
}


export const initialMetrics = {
    productionCalculations: [] as [string, string][],
    ingredientSummary: [] as [string, string, string][]
};
