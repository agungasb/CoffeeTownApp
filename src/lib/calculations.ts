
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
    if (recipe.baseWeight && recipe.baseWeight > 0) {
        return recipe.baseWeight;
    }
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
        return (productData?.calculation?.divisor && productData.calculation.divisor > 0) ? productData.calculation.divisor : 1;
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
    
    // --- Recipe Calculations ---

    // 1. Dough Recipes (using baseRecipe link)
    const doughRecipeNames = [
        'Adonan Donut Paha Ayam',
        'Adonan Roti Manis Roll',
        'Adonan Roti Manis Mesin',
        'Adonan Donat Joko',
        'Adonan Abon Taiwan'
    ];
    const recipeWeightTotals: { [recipeName: string]: number } = {};

    for (const productName in numInputs) {
        const quantity = numInputs[productName.toLowerCase()];
        if (quantity > 0) {
            const productData = findProductData(productName, productIngredientsData);
            if (productData?.baseRecipe && doughRecipeNames.includes(productData.baseRecipe.recipeName)) {
                const { recipeName, weight } = productData.baseRecipe;
                if (!recipeWeightTotals[recipeName]) {
                    recipeWeightTotals[recipeName] = 0;
                }
                recipeWeightTotals[recipeName] += quantity * weight;
            }
        }
    }

    const recipeMultiplierMap: { [recipeName: string]: number } = {};

    for (const recipeName in recipeWeightTotals) {
        const totalDoughWeight = recipeWeightTotals[recipeName];
        if (totalDoughWeight > 0) {
            const recipeBaseWeight = getRecipeBaseWeight(recipeName, allRecipes);
            if (recipeBaseWeight > 0) {
                const recipesNeeded = totalDoughWeight / recipeBaseWeight;
                recipeMultiplierMap[recipeName] = recipesNeeded;
                if (recipeName === 'Adonan Abon Taiwan') {
                    productionCalculations.push([recipeName, `${recipesNeeded.toFixed(2)} resep (*kali 2 telur)`]);
                } else {
                    productionCalculations.push([recipeName, `${recipesNeeded.toFixed(2)} resep`]);
                }
            }
        }
    }
    
    // 2. Other Filling/Topping Recipes (Hardcoded)
    const eggCreamResep = ((numInputs['abon ayam pedas'] || 0) * 18 + (numInputs['abon sosis'] || 0) * 10 + (numInputs['abon piramid'] || 0) * 24 + (numInputs['abon roll pedas'] || 0) * 18) / (getRecipeBaseWeight('Egg Cream', allRecipes) || 1);
    if (eggCreamResep > 0) {
        productionCalculations.push(["Egg Cream", `${eggCreamResep.toFixed(2)} resep`]);
        recipeMultiplierMap["Egg Cream"] = eggCreamResep;
    }

    const creamCheeseResep = ((numInputs['red velvet cream cheese'] || 0) * 48) / (getRecipeBaseWeight('Cream Cheese', allRecipes) || 1);
    if (creamCheeseResep > 0) {
        productionCalculations.push(["Cream Cheese", `${creamCheeseResep.toFixed(2)} resep`]);
        recipeMultiplierMap["Cream Cheese"] = creamCheeseResep;
    }

    const butterResep = ((numInputs['cream choco cheese'] || 0) * 17 + (numInputs['cheese roll'] || 0) * 13) / (getRecipeBaseWeight('Butter', allRecipes) || 1);
    if (butterResep > 0) {
        productionCalculations.push(["Butter", `${butterResep.toFixed(2)} resep`]);
        recipeMultiplierMap["Butter"] = butterResep;
    }

    const butterDonatResep = ((numInputs['donut paha ayam'] || 0) * 12) / (getRecipeBaseWeight('Butter Donat', allRecipes) || 1);
    if (butterDonatResep > 0) {
        productionCalculations.push(["Butter Donat", `${butterDonatResep.toFixed(2)} resep`]);
        recipeMultiplierMap["Butter Donat"] = butterDonatResep;
    }

    const coklatGanacheResep = ((numInputs['double coklat'] || 0) * 17) / (getRecipeBaseWeight('Coklat Ganache', allRecipes) || 1);
    if (coklatGanacheResep > 0) {
        productionCalculations.push(["Coklat Ganache", `${coklatGanacheResep.toFixed(2)} resep`]);
        recipeMultiplierMap["Coklat Ganache"] = coklatGanacheResep;
    }

    const toppingMaxicanaResep = ((numInputs['maxicana coklat'] || 0) * 10) / (getRecipeBaseWeight('Topping Maxicana', allRecipes) || 1);
    if (toppingMaxicanaResep > 0) {
        productionCalculations.push(["Topping Maxicana", `${toppingMaxicanaResep.toFixed(2)} resep`]);
        recipeMultiplierMap["Topping Maxicana"] = toppingMaxicanaResep;
    }

    const flaAbonTaiwanResep = ((numInputs['abon taiwan'] || 0) * 30) / (getRecipeBaseWeight('Fla Abon Taiwan', allRecipes) || 1);
    if (flaAbonTaiwanResep > 0) {
        productionCalculations.push(["Fla Abon Taiwan", `${flaAbonTaiwanResep.toFixed(2)} resep`]);
        recipeMultiplierMap["Fla Abon Taiwan"] = flaAbonTaiwanResep;
    }

    // --- Ingredient Summary Calculation ---
    for (const [recipeName, recipeMultiplier] of Object.entries(recipeMultiplierMap)) {
        if (recipeMultiplier > 0) {
            const recipe = findRecipe(recipeName, allRecipes);
            if (recipe) {
                recipe.ingredients.forEach(ing => {
                    const totalAmount = ing.amount * recipeMultiplier;
                    const ingredientName = ing.name.toLowerCase();
                    if (!ingredientSummaryMap[ingredientName]) {
                        ingredientSummaryMap[ingredientName] = { amount: 0, unit: ing.unit };
                    }
                    ingredientSummaryMap[ingredientName].amount += totalAmount;
                });
            }
        }
    }
    
    // Add non-recipe ingredients from products
     for (const productName in numInputs) {
        const quantity = numInputs[productName.toLowerCase()];
        if (quantity > 0) {
            const productData = findProductData(productName, productIngredientsData);
            if (productData) {
                for (const ingName in productData.ingredients) {
                    const ingData = productData.ingredients[ingName];
                    const totalAmount = ingData.amount * quantity;
                    const ingredientName = ingName.toLowerCase();
                    if (!ingredientSummaryMap[ingredientName]) {
                        ingredientSummaryMap[ingredientName] = { amount: 0, unit: ingData.unit };
                    }
                    ingredientSummaryMap[ingredientName].amount += totalAmount;
                }
            }
        }
    }

    const ingredientSummary = Object.entries(ingredientSummaryMap)
        .map(([name, { amount, unit }]) => [capitalize(name), amount.toFixed(2), unit] as [string, string, string])
        .sort((a, b) => a[0].localeCompare(b[0]));
        
    return {
        productionCalculations: productionCalculations.sort((a, b) => a[0].localeCompare(b[0])),
        ingredientSummary,
    };
}


export const initialMetrics = {
    productionCalculations: [] as [string, string][],
    ingredientSummary: [] as [string, string, string][]
};
