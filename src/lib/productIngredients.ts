
export interface IngredientData {
    amount: number;
    unit: string;
}

export interface CalculationData {
    divisor?: number;
    unit?: string;
    multiplier?: number;
}

export interface BaseRecipeData {
    recipeName: string;
    weight: number;
}

export interface ProductData {
    ingredients: {
        [ingredientName: string]: IngredientData;
    };
    baseRecipe?: BaseRecipeData;
    calculation?: CalculationData;
}

export interface AllProductsData {
    [productName: string]: ProductData;
}

export const productIngredientsData: AllProductsData = {
    // Roti Manis
    "maxicana coklat": {
        baseRecipe: { recipeName: "Adonan Roti Manis Mesin", weight: 45 },
        ingredients: {
            "topping maxicana": { amount: 10, unit: "g"},
            "coklat filling": { amount: 10, unit: "g" },
        },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "abon ayam pedas": {
        baseRecipe: { recipeName: "Adonan Roti Manis Mesin", weight: 45 },
        ingredients: {
            "egg cream": { amount: 18, unit: "g" },
            "abon": { amount: 15, unit: "g" },
        },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "red velvet cream cheese": {
        baseRecipe: { recipeName: "Adonan Roti Manis Mesin", weight: 45 },
        ingredients: {
            "cream cheese": { amount: 48, unit: "g" },
            "crumble velvet": { amount: 15, unit: "g" },
            "white chox": { amount: 20.5, unit: "g" },
        },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "abon sosis": {
        baseRecipe: { recipeName: "Adonan Roti Manis Mesin", weight: 45 },
        ingredients: {
            "egg cream": { amount: 10, unit: "g" },
            "sosis": { amount: 0.5, unit: "pcs" },
            "abon": { amount: 5, unit: "g" },
        },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "cream choco cheese": {
        baseRecipe: { recipeName: "Adonan Roti Manis Mesin", weight: 45 },
        ingredients: {
            "butter": { amount: 17, unit: "g" },
            "keju": { amount: 15, unit: "g" },
            "ceres": { amount: 20, unit: "g" },
        },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "double coklat": {
        baseRecipe: { recipeName: "Adonan Roti Manis Mesin", weight: 45 },
        ingredients: {
            "coklat ganache": { amount: 17, unit: "g"},
            "ceres": { amount: 25, unit: "g" },
            "coklat filling": { amount: 15, unit: "g" },
        },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "hot sosis": {
        baseRecipe: { recipeName: "Adonan Roti Manis Mesin", weight: 45 },
        ingredients: {
            "sosis": { amount: 1, unit: "pcs" },
            "daun bawang": { amount: 0.5, unit: "g" },
            "puratos": { amount: 1, unit: "g" }
        },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "kacang merah": {
        baseRecipe: { recipeName: "Adonan Roti Manis Mesin", weight: 45 },
        ingredients: {
            "kacang merah": { amount: 35, unit: "g" },
            "puratos": { amount: 1, unit: "g" }
        },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "sosis label": {
        baseRecipe: { recipeName: "Adonan Roti Manis Mesin", weight: 45 },
        ingredients: {
            "saos sambal": { amount: 0.5, unit: "g" },
            "saos tomat": { amount: 0.5, unit: "g" },
            "daun bawang": { amount: 0.5, unit: "g" },
            "puratos": { amount: 1, unit: "g" },
            "sosis": { amount: 1, unit: "pcs" }
        },
        calculation: { divisor: 12, unit: 'loyang' }
    },
    "strawberry almond": {
        baseRecipe: { recipeName: "Adonan Roti Manis Mesin", weight: 45 },
        ingredients: {
            "selai straw": { amount: 10, unit: "g" },
            "almond": { amount: 15, unit: "g" },
            "white chox": { amount: 15, "unit": "g" }
        },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "vanilla oreo": {
        baseRecipe: { recipeName: "Adonan Roti Manis Mesin", weight: 45 },
        ingredients: {
            "sonton vanilla": { amount: 10, unit: "g" },
            "crumble oreo": { amount: 15, unit: "g" },
            "coklat filling": { amount: 20, unit: "g" },
            "white chox": { amount: 0.5, unit: "g" }
        },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "abon piramid": {
        baseRecipe: { recipeName: "Adonan Roti Manis Roll", weight: 45 },
        ingredients: {
            "egg cream": { amount: 24, unit: "g" },
            "daun bawang": { amount: 0.5, unit: "g" },
            "abon": { amount: 1.5, unit: "g" },
            "puratos": { amount: 0.5, unit: "g" },
        },
        calculation: { divisor: 11, unit: 'loyang' }
    },
    "abon roll pedas": {
        baseRecipe: { recipeName: "Adonan Roti Manis Roll", weight: 45 },
        ingredients: {
            "egg cream": { amount: 18, unit: "g" },
            "daun bawang": { amount: 0.5, unit: "g" },
            "abon": { amount: 1.5, unit: "g" },
            "puratos": { amount: 0.5, unit: "g" },
        },
        calculation: { divisor: 12, unit: 'loyang' }
    },
    "cheese roll": {
        baseRecipe: { recipeName: "Adonan Roti Manis Roll", weight: 45 },
        ingredients: {
            "butter": { amount: 13, unit: "g" },
            "keju": { amount: 20, unit: "g" },
            "mayonaise": { amount: 0.5, unit: "g" },
            "puratos": { amount: 0.5, unit: "g" },
        },
        calculation: { divisor: 12, unit: 'loyang' }
    },
    "donut paha ayam": {
        baseRecipe: { recipeName: "Adonan Donut Paha Ayam", weight: 45 },
        ingredients: {
            "butter donat": { amount: 12, unit: "g" },
    	    "ceres": { amount: 20, unit: "g" },
    	    "tusuk sate": { amount: 1, unit: "pcs" },
        },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "abon taiwan": {
        baseRecipe: { recipeName: "Adonan Abon Taiwan", weight: 0.25 }, // Special case, unit is resep
        ingredients: {
            "fla abon taiwan": { amount: 30, unit: "g" },
    	    "abon": { amount: 5, unit: "g" },
    	    "mayonaise": { amount: 1.5, unit: "g" },
    	    "wijen putih": { amount: 0.5, unit: "g" },
    	    "wijen hitam": { amount: 0.5, unit: "g" },
        },
        calculation: { divisor: 15, unit: 'loyang', multiplier: 2 }
    },
    // Donut Department
    "Donut Almond": { 
        baseRecipe: { recipeName: "Adonan Donat Joko", weight: 45 },
        ingredients: { "almond": { amount: 15, unit: "g" } },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "Donut Coklat Ceres": { 
        baseRecipe: { recipeName: "Adonan Donat Joko", weight: 45 },
        ingredients: { "ceres": { amount: 15, unit: "g" } },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "Donut Coklat Kacang": { 
        baseRecipe: { recipeName: "Adonan Donat Joko", weight: 45 },
        ingredients: { "kacang tanah": { amount: 10, unit: "g" }, "coklat filling": { amount: 5, unit: "g" } },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "Donut Gula Halus": { 
        baseRecipe: { recipeName: "Adonan Donat Joko", weight: 45 },
        ingredients: { "gula halus": { amount: 15, unit: "g" } },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "Donut Keju": { 
        baseRecipe: { recipeName: "Adonan Donat Joko", weight: 45 },
        ingredients: { "keju": { amount: 15, unit: "g" } },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "Donut Oreo": { 
        baseRecipe: { recipeName: "Adonan Donat Joko", weight: 45 },
        ingredients: { "crumble oreo": { amount: 15, unit: "g" } },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "7K BOMBOLONI CAPPUCINO": { 
        baseRecipe: { recipeName: "Adonan Donat Joko", weight: 45 },
        ingredients: { "cappucino filling": { amount: 20, unit: "g" } },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "7K BOMBOLONI DARK COKLAT": { 
        baseRecipe: { recipeName: "Adonan Donat Joko", weight: 45 },
        ingredients: { "dark coklat filling (bomboloni)": { amount: 20, unit: "g" } },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "7K BOMBOLONI GREENTEA": { 
        baseRecipe: { recipeName: "Adonan Donat Joko", weight: 45 },
        ingredients: { "greentea filling": { amount: 20, unit: "g" } },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "7K BOMBOLONI TIRAMISU": { 
        baseRecipe: { recipeName: "Adonan Donat Joko", weight: 45 },
        ingredients: { "tiramisu filling": { amount: 20, unit: "g" } },
        calculation: { divisor: 15, unit: 'loyang' }
    },
};
