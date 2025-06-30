
export interface IngredientData {
    amount: number;
    unit: string;
}

export interface CalculationData {
    divisor?: number;
    unit?: string;
    multiplier?: number;
}

export interface ProductData {
    ingredients: {
        [ingredientName: string]: IngredientData;
    };
    calculation?: CalculationData;
}

export interface AllProductsData {
    [productName: string]: ProductData;
}

// Standard dough weight per piece
const standardDoughWeight = 45; // in grams

export const productIngredientsData: AllProductsData = {
    // Roti Manis
    "maxicana coklat": {
        ingredients: {
            "Adonan Roti Manis Mesin": { amount: standardDoughWeight, unit: "g"},
            "Topping Maxicana": { amount: 10, unit: "g"},
            "coklat filling": { amount: 10, unit: "g" },
        },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "abon ayam pedas": {
        ingredients: {
            "Adonan Roti Manis Mesin": { amount: standardDoughWeight, unit: "g" },
            "Egg Cream": { amount: 18, unit: "g" },
            "abon": { amount: 15, unit: "g" },
        },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "red velvet cream cheese": {
        ingredients: {
            "Adonan Roti Manis Mesin": { amount: standardDoughWeight, unit: "g" },
            "Cream Cheese": { amount: 48, unit: "g" },
            "crumble velvet": { amount: 15, unit: "g" },
            "white chox": { amount: 20.5, unit: "g" },
        },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "abon sosis": {
        ingredients: {
            "Adonan Roti Manis Mesin": { amount: standardDoughWeight, unit: "g" },
            "Egg Cream": { amount: 10, unit: "g" },
            "sosis": { amount: 0.5, unit: "pcs" },
            "abon": { amount: 5, unit: "g" },
        },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "cream choco cheese": {
        ingredients: {
            "Adonan Roti Manis Mesin": { amount: standardDoughWeight, unit: "g" },
            "Butter": { amount: 17, unit: "g" },
            "keju": { amount: 15, unit: "g" },
            "ceres": { amount: 20, unit: "g" },
        },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "double coklat": {
        ingredients: {
            "Adonan Roti Manis Mesin": { amount: standardDoughWeight, unit: "g" },
            "Coklat Ganache": { amount: 17, unit: "g"},
            "ceres": { amount: 25, unit: "g" },
            "coklat filling": { amount: 15, unit: "g" },
        },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "hot sosis": {
        ingredients: {
            "Adonan Roti Manis Mesin": { amount: standardDoughWeight, unit: "g" },
            "sosis": { amount: 1, unit: "pcs" },
            "daun bawang": { amount: 0.5, unit: "g" },
            "puratos": { amount: 1, unit: "g" }
        },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "kacang merah": {
        ingredients: {
            "Adonan Roti Manis Mesin": { amount: standardDoughWeight, unit: "g" },
            "kacang merah": { amount: 35, unit: "g" },
            "puratos": { amount: 1, unit: "g" }
        },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "sosis label": {
        ingredients: {
            "Adonan Roti Manis Mesin": { amount: standardDoughWeight, unit: "g" },
            "saos sambal": { amount: 0.5, unit: "g" },
            "saos tomat": { amount: 0.5, unit: "g" },
            "daun bawang": { amount: 0.5, unit: "g" },
            "puratos": { amount: 1, unit: "g" },
            "sosis": { amount: 1, unit: "pcs" }
        },
        calculation: { divisor: 12, unit: 'loyang' }
    },
    "strawberry almond": {
        ingredients: {
            "Adonan Roti Manis Mesin": { amount: standardDoughWeight, unit: "g" },
            "selai straw": { amount: 10, unit: "g" },
            "almond": { amount: 15, unit: "g" },
            "white chox": { amount: 15, "unit": "g" }
        },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "vanilla oreo": {
        ingredients: {
            "Adonan Roti Manis Mesin": { amount: standardDoughWeight, unit: "g" },
            "sonton vanilla": { amount: 10, unit: "g" },
            "crumble oreo": { amount: 15, unit: "g" },
            "coklat filling": { amount: 20, unit: "g" },
            "white chox": { amount: 0.5, unit: "g" }
        },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "abon piramid": {
        ingredients: {
            "Adonan Roti Manis Roll": { amount: standardDoughWeight, unit: "g" },
            "Egg Cream": { amount: 24, unit: "g" },
            "daun bawang": { amount: 0.5, unit: "g" },
            "abon": { amount: 1.5, unit: "g" },
            "puratos": { amount: 0.5, unit: "g" },
        },
        calculation: { divisor: 11, unit: 'loyang' }
    },
    "abon roll pedas": {
        ingredients: {
            "Adonan Roti Manis Roll": { amount: standardDoughWeight, unit: "g" },
            "Egg Cream": { amount: 18, unit: "g" },
            "daun bawang": { amount: 0.5, unit: "g" },
            "abon": { amount: 1.5, unit: "g" },
            "puratos": { amount: 0.5, unit: "g" },
        },
        calculation: { divisor: 12, unit: 'loyang' }
    },
    "cheese roll": {
        ingredients: {
            "Adonan Roti Manis Roll": { amount: standardDoughWeight, unit: "g" },
            "Butter": { amount: 13, unit: "g" },
            "keju": { amount: 20, unit: "g" },
            "mayonaise": { amount: 0.5, unit: "g" },
            "puratos": { amount: 0.5, unit: "g" },
        },
        calculation: { divisor: 12, unit: 'loyang' }
    },
    "donut paha ayam": {
        ingredients: {
    	    "Adonan Donut Paha Ayam": { amount: standardDoughWeight, unit: "g" },
            "Butter Donat": { amount: 12, unit: "g" },
    	    "ceres": { amount: 20, unit: "g" },
    	    "tusuk sate": { amount: 1, unit: "pcs" },
        },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "abon taiwan": {
        ingredients: {
            "Adonan Abon Taiwan": { amount: 0.25, unit: "resep" },
            "Fla Abon Taiwan": { amount: 30, unit: "g" },
    	    "abon": { amount: 5, unit: "g" },
    	    "mayonaise": { amount: 1.5, unit: "g" },
    	    "wijen putih": { amount: 0.5, unit: "g" },
    	    "wijen hitam": { amount: 0.5, unit: "g" },
        },
        calculation: { divisor: 15, unit: 'loyang', multiplier: 2 }
    },
    // Donut Department
    "Donut Almond": { 
        ingredients: { "Adonan Donat Joko": { amount: standardDoughWeight, unit: "g" }, "almond": { amount: 15, unit: "g" } },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "Donut Coklat Ceres": { 
        ingredients: { "Adonan Donat Joko": { amount: standardDoughWeight, unit: "g" }, "ceres": { amount: 15, unit: "g" } },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "Donut Coklat Kacang": { 
        ingredients: { "Adonan Donat Joko": { amount: standardDoughWeight, unit: "g" }, "kacang tanah": { amount: 10, unit: "g" }, "coklat filling": { amount: 5, unit: "g" } },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "Donut Gula Halus": { 
        ingredients: { "Adonan Donat Joko": { amount: standardDoughWeight, unit: "g" }, "gula halus": { amount: 15, unit: "g" } },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "Donut Keju": { 
        ingredients: { "Adonan Donat Joko": { amount: standardDoughWeight, unit: "g" }, "keju": { amount: 15, unit: "g" } },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "Donut Oreo": { 
        ingredients: { "Adonan Donat Joko": { amount: standardDoughWeight, unit: "g" }, "crumble oreo": { amount: 15, unit: "g" } },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "7K BOMBOLONI CAPPUCINO": { 
        ingredients: { "Adonan Donat Joko": { amount: standardDoughWeight, unit: "g" }, "cappucino filling": { amount: 20, unit: "g" } },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "7K BOMBOLONI DARK COKLAT": { 
        ingredients: { "Adonan Donat Joko": { amount: standardDoughWeight, unit: "g" }, "dark coklat filling (bomboloni)": { amount: 20, unit: "g" } },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "7K BOMBOLONI GREENTEA": { 
        ingredients: { "Adonan Donat Joko": { amount: standardDoughWeight, unit: "g" }, "greentea filling": { amount: 20, unit: "g" } },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "7K BOMBOLONI TIRAMISU": { 
        ingredients: { "Adonan Donat Joko": { amount: standardDoughWeight, unit: "g" }, "tiramisu filling": { amount: 20, unit: "g" } },
        calculation: { divisor: 15, unit: 'loyang' }
    },
};
