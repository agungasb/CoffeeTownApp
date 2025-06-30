
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

const donutPahaAyamBase = {
    "tepung": { amount: 12.25, unit: "g" },
    "premix": { amount: 12.25, unit: "g" },
    "gula pasir": { amount: 2.94, unit: "g" },
    "susu bubuk": { amount: 1.225, unit: "g" },
    "ragi": { amount: 0.3675, unit: "g" },
    "pelembut": { amount: 0.0735, unit: "g" },
    "telur utuh": { amount: 0.0735, unit: "g" },
    "margarin": { amount: 1.8375, unit: "g" },
    "bos": { amount: 1.8375, unit: "g" },
    "garam": { amount: 0.294, unit: "g" },
    "air": { amount: 3.675, unit: "g" },
    "es batu": { amount: 3.675, unit: "g" },
};

const adonanRotiManisMesin = {
    "tepung": { amount: 24.5, unit: "g" },
    "gula pasir": { amount: 3.675, unit: "g" },
    "susu bubuk": { amount: 1.225, unit: "g" },
    "pelembut": { amount: 0.196, unit: "g" },
    "ragi": { amount: 0.3675, unit: "g" },
    "es batu": { amount: 3.675, unit: "g" },
    "air": { amount: 4.9, unit: "g" },
    "margarin": { amount: 1.8375, unit: "g" },
    "bos": { amount: 1.8375, unit: "g" },
    "garam": { amount: 0.3675, unit: "g" },
    "bakom": { amount: 0.6125, unit: "g" },
    "telur utuh": { amount: 0.0735, unit: "g" },
    "telur kuning": { amount: 0.049, unit: "g" },
};

const adonanRotiManisRoll = {
    "tepung": { amount: 33.3333, unit: "g" },
    "gula pasir": { amount: 5, unit: "g" },
    "susu bubuk": { amount: 1.6666, unit: "g" },
    "pelembut": { amount: 0.2666, unit: "g" },
    "ragi": { amount: 0.5, unit: "g" },
    "es batu": { amount: 5, unit: "g" },
    "air": { amount: 6.6666, unit: "g" },
    "margarin": { amount: 2.5, unit: "g" },
    "bos": { amount: 2.5, unit: "g" },
    "garam": { amount: 0.5, unit: "g" },
    "bakom": { amount: 0.8333, unit: "g" },
    "telur utuh": { amount: 0.1, unit: "g" },
    "telur kuning": { amount: 0.06666, unit: "g" },
};

export const productIngredientsData: AllProductsData = {
    // Roti Manis
    "maxicana coklat": {
        ingredients: {
            ...adonanRotiManisMesin,
            "Topping Maxicana": { amount: 10, unit: "g"},
            "coklat filling": { amount: 10, unit: "g" },
        },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "abon ayam pedas": {
        ingredients: {
            ...adonanRotiManisMesin,
            "Egg Cream": { amount: 18, unit: "g" },
            "abon": { amount: 15, unit: "g" },
        },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "red velvet cream cheese": {
        ingredients: {
            ...adonanRotiManisMesin,
            "Cream Cheese": { amount: 48, unit: "g" },
            "crumble velvet": { amount: 15, unit: "g" },
            "white chox": { amount: 20.5, unit: "g" },
        },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "abon sosis": {
        ingredients: {
            ...adonanRotiManisMesin,
            "Egg Cream": { amount: 10, unit: "g" },
            "sosis": { amount: 0.5, unit: "pcs" },
            "abon": { amount: 5, unit: "g" },
        },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "cream choco cheese": {
        ingredients: {
            ...adonanRotiManisMesin,
            "Butter": { amount: 17, unit: "g" },
            "keju": { amount: 15, unit: "g" },
            "ceres": { amount: 20, unit: "g" },
        },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "double coklat": {
        ingredients: {
            ...adonanRotiManisMesin,
            "Coklat Ganache": { amount: 17, unit: "g"},
            "ceres": { amount: 25, unit: "g" },
            "coklat filling": { amount: 15, unit: "g" },
        },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "hot sosis": {
        ingredients: {
            ...adonanRotiManisMesin,
            "sosis": { amount: 1, unit: "pcs" },
            "daun bawang": { amount: 0.5, unit: "g" },
            "puratos": { amount: 1, unit: "g" }
        },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "kacang merah": {
        ingredients: {
            ...adonanRotiManisMesin,
            "kacang merah": { amount: 35, unit: "g" },
            "puratos": { amount: 1, unit: "g" }
        },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "sosis label": {
        ingredients: {
            ...adonanRotiManisMesin,
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
            ...adonanRotiManisMesin,
            "selai straw": { amount: 10, unit: "g" },
            "almond": { amount: 15, unit: "g" },
            "white chox": { amount: 15, "unit": "g" }
        },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "vanilla oreo": {
        ingredients: {
            ...adonanRotiManisMesin,
            "sonton vanilla": { amount: 10, unit: "g" },
            "crumble oreo": { amount: 15, unit: "g" },
            "coklat filling": { amount: 20, unit: "g" },
            "white chox": { amount: 0.5, unit: "g" }
        },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "abon piramid": {
        ingredients: {
            ...adonanRotiManisRoll,
            "Egg Cream": { amount: 24, unit: "g" },
            "daun bawang": { amount: 0.5, unit: "g" },
            "abon": { amount: 1.5, unit: "g" },
            "puratos": { amount: 0.5, unit: "g" },
        },
        calculation: { divisor: 11, unit: 'loyang' }
    },
    "abon roll pedas": {
        ingredients: {
            ...adonanRotiManisRoll,
            "Egg Cream": { amount: 18, unit: "g" },
            "daun bawang": { amount: 0.5, unit: "g" },
            "abon": { amount: 1.5, unit: "g" },
            "puratos": { amount: 0.5, unit: "g" },
        },
        calculation: { divisor: 12, unit: 'loyang' }
    },
    "cheese roll": {
        ingredients: {
            ...adonanRotiManisRoll,
            "Butter": { amount: 13, unit: "g" },
            "keju": { amount: 20, unit: "g" },
            "mayonaise": { amount: 0.5, unit: "g" },
            "puratos": { amount: 0.5, unit: "g" },
        },
        calculation: { divisor: 12, unit: 'loyang' }
    },
    "donut paha ayam": {
        ingredients: {
    	    ...donutPahaAyamBase,
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
    "Donut Almond": { ingredients: { ...donutPahaAyamBase, "almond": { amount: 15, unit: "g" } } },
    "Donut Coklat Ceres": { ingredients: { ...donutPahaAyamBase, "ceres": { amount: 15, unit: "g" } } },
    "Donut Coklat Kacang": { ingredients: { ...donutPahaAyamBase, "kacang tanah": { amount: 10, unit: "g" }, "coklat filling": { amount: 5, unit: "g" } } },
    "Donut Gula Halus": { ingredients: { ...donutPahaAyamBase, "gula halus": { amount: 15, unit: "g" } } },
    "Donut Keju": { ingredients: { ...donutPahaAyamBase, "keju": { amount: 15, unit: "g" } } },
    "Donut Oreo": { ingredients: { ...donutPahaAyamBase, "crumble oreo": { amount: 15, unit: "g" } } },
    "7K BOMBOLONI CAPPUCINO": { ingredients: { ...donutPahaAyamBase, "cappucino filling": { amount: 20, unit: "g" } } },
    "7K BOMBOLONI DARK COKLAT": { ingredients: { ...donutPahaAyamBase, "dark coklat filling (bomboloni)": { amount: 20, unit: "g" } } },
    "7K BOMBOLONI GREENTEA": { ingredients: { ...donutPahaAyamBase, "greentea filling": { amount: 20, unit: "g" } } },
    "7K BOMBOLONI TIRAMISU": { ingredients: { ...donutPahaAyamBase, "tiramisu filling": { amount: 20, unit: "g" } } },
};
