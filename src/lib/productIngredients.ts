
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
    "margarin": { amount: 10.8375, unit: "g" },
    "bos": { amount: 1.8375, unit: "g" },
    "garam": { amount: 0.294, unit: "g" },
    "air": { amount: 3.675, unit: "g" },
    "es batu": { amount: 3.675, unit: "g" },
};

export const productIngredientsData: AllProductsData = {
    // Roti Manis
    "maxicana coklat": {
        ingredients: {
            "tepung": { amount: 29.794, unit: "g" },
            "gula pasir": { amount: 3.675, unit: "g" },
            "susu bubuk": { amount: 1.225, unit: "g" },
            "pelembut": { amount: 0.196, unit: "g" },
            "ragi": { amount: 0.3675, unit: "g" },
            "es batu": { amount: 3.675, unit: "g" },
            "air": { amount: 4.9, unit: "g" },
            "skm": { amount: 1.225, unit: "g" },
            "margarin": { amount: 6.2492, unit: "g" },
            "bos": { amount: 1.8375, unit: "g" },
            "garam": { amount: 0.3675, unit: "g" },
            "bakom": { amount: 0.6125, unit: "g" },
            "telur utuh": { amount: 0.0735, unit: "g" },
            "telur kuning": { amount: 0.049, unit: "g" },
            "coklat filling": { amount: 10, unit: "g" },
            "gula halus": { amount: 4.41176, unit: "g" },
            "putih telur": { amount: 5.147, unit: "g" },
            "maizena": { amount: 0.735, unit: "g" }
        },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "abon ayam pedas": {
        ingredients: {
            "tepung": { amount: 24.5, unit: "g" },
            "gula pasir": { amount: 3.7775, unit: "g" },
            "susu bubuk": { amount: 1.225, unit: "g" },
            "pelembut": { amount: 0.196, unit: "g" },
            "ragi": { amount: 0.3675, unit: "g" },
            "es batu": { amount: 3.675, unit: "g" },
            "air": { amount: 4.9, unit: "g" },
            "skm": { amount: 1.635, unit: "g" },
            "margarin": { amount: 1.8375, unit: "g" },
            "bos": { amount: 1.8375, unit: "g" },
            "garam": { amount: 0.38287, unit: "g" },
            "bakom": { amount: 0.6125, unit: "g" },
            "telur utuh": { amount: 0.07965, unit: "g" },
            "telur kuning": { amount: 0.049, unit: "g" },
            "abon": { amount: 15, unit: "g" },
            "cuka": { amount: 0.030755, unit: "g" },
            "minyak": { amount: 1.435, unit: "g" }
        },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "red velvet cream cheese": {
        ingredients: {
            "tepung": { amount: 24.5, unit: "g" },
            "gula pasir": { amount: 3.675, unit: "g" },
            "susu bubuk": { amount: 1.225, unit: "g" },
            "pelembut": { amount: 0.196, unit: "g" },
            "ragi": { amount: 0.3675, unit: "g" },
            "es batu": { amount: 3.675, unit: "g" },
            "air": { amount: 4.9, unit: "g" },
            "skm": { amount: 1.225, unit: "g" },
            "margarin": { amount: 5.8375, unit: "g" },
            "bos": { amount: 1.8375, unit: "g" },
            "garam": { amount: 0.3675, unit: "g" },
            "bakom": { amount: 0.6125, unit: "g" },
            "telur utuh": { amount: 0.0735, unit: "g" },
            "telur kuning": { amount: 0.049, unit: "g" },
            "crumble velvet": { amount: 15, unit: "g" },
            "white chox": { amount: 20.5, unit: "g" },
            "gula halus": { amount: 2, unit: "g" },
            "optimo": { amount: 4, unit: "g" }
        },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "abon sosis": {
        ingredients: {
            "tepung": { amount: 24.5, unit: "g" },
            "gula pasir": { amount: 3.7775, unit: "g" },
            "susu bubuk": { amount: 1.225, unit: "g" },
            "pelembut": { amount: 0.196, unit: "g" },
            "ragi": { amount: 0.3675, unit: "g" },
            "es batu": { amount: 3.675, unit: "g" },
            "air": { amount: 4.9, unit: "g" },
            "skm": { amount: 1.635, unit: "g" },
            "margarin": { amount: 1.8375, unit: "g" },
            "bos": { amount: 1.8375, unit: "g" },
            "garam": { amount: 0.38287, unit: "g" },
            "bakom": { amount: 0.6125, unit: "g" },
            "telur utuh": { amount: 0.07965, unit: "g" },
            "telur kuning": { amount: 0.049, unit: "g" },
            "sosis": { amount: 0.5, unit: "g" },
            "mayonaise": { amount: 1, unit: "g" },
            "saos sambal": { amount: 0.5, unit: "g" },
            "saos tomat": { amount: 0.5, unit: "g" },
            "abon": { amount: 5, unit: "g" },
            "cuka": { amount: 0.030755, unit: "g" },
            "minyak": { amount: 1.435, unit: "g" }
        },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "cream choco cheese": {
        ingredients: {
            "tepung": { amount: 24.5, unit: "g" },
            "gula pasir": { amount: 3.675, unit: "g" },
            "susu bubuk": { amount: 1.225, unit: "g" },
            "pelembut": { amount: 0.196, unit: "g" },
            "ragi": { amount: 0.3675, unit: "g" },
            "es batu": { amount: 3.675, unit: "g" },
            "air": { amount: 4.9, unit: "g" },
            "skm": { amount: 3.4472, unit: "g" },
            "margarin": { amount: 15.17, unit: "g" },
            "bos": { amount: 1.8375, unit: "g" },
            "garam": { amount: 0.3675, unit: "g" },
            "bakom": { amount: 0.6125, unit: "g" },
            "telur utuh": { amount: 0.0735, unit: "g" },
            "telur kuning": { amount: 0.049, unit: "g" },
            "keju": { amount: 15, unit: "g" },
            "ceres": { amount: 20, unit: "g" },
            "gula halus": { amount: 4.444, unit: "g" }
        },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "double coklat": {
        ingredients: {
            "tepung": { amount: 24.5, unit: "g" },
            "gula pasir": { amount: 3.675, unit: "g" },
            "susu bubuk": { amount: 1.225, unit: "g" },
            "pelembut": { amount: 0.196, unit: "g" },
            "ragi": { amount: 0.3675, unit: "g" },
            "es batu": { amount: 3.675, unit: "g" },
            "air": { amount: 4.9, unit: "g" },
            "skm": { amount: 1.225, unit: "g" },
            "margarin": { amount: 1.8375, unit: "g" },
            "bos": { amount: 1.8375, unit: "g" },
            "garam": { amount: 0.3675, unit: "g" },
            "bakom": { amount: 0.6125, unit: "g" },
            "telur utuh": { amount: 0.0735, unit: "g" },
            "telur kuning": { amount: 0.049, unit: "g" },
            "ceres": { amount: 25, unit: "g" },
            "coklat filling": { amount: 15, unit: "g" },
            "dark chox": { amount: 8.333, unit: "g" },
            "uht": { amount: 1.666, unit: "g" }
        },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "hot sosis": {
        ingredients: {
            "tepung": { amount: 24.5, unit: "g" },
            "gula pasir": { amount: 3.675, unit: "g" },
            "susu bubuk": { amount: 1.225, unit: "g" },
            "pelembut": { amount: 0.196, unit: "g" },
            "ragi": { amount: 0.3675, unit: "g" },
            "es batu": { amount: 3.675, unit: "g" },
            "air": { amount: 4.9, unit: "g" },
            "skm": { amount: 1.225, unit: "g" },
            "margarin": { amount: 1.8375, unit: "g" },
            "bos": { amount: 1.8375, unit: "g" },
            "garam": { amount: 0.3675, unit: "g" },
            "bakom": { amount: 0.6125, unit: "g" },
            "telur utuh": { amount: 0.0735, unit: "g" },
            "telur kuning": { amount: 0.049, unit: "g" },
            "sosis": { amount: 1, unit: "g" },
            "daun bawang": { amount: 0.5, unit: "g" },
            "puratos": { amount: 1, unit: "g" }
        },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "kacang merah": {
        ingredients: {
            "tepung": { amount: 24.5, unit: "g" },
            "gula pasir": { amount: 3.675, unit: "g" },
            "susu bubuk": { amount: 1.225, unit: "g" },
            "pelembut": { amount: 0.196, unit: "g" },
            "ragi": { amount: 0.3675, unit: "g" },
            "es batu": { amount: 3.675, unit: "g" },
            "air": { amount: 4.9, unit: "g" },
            "skm": { amount: 1.225, unit: "g" },
            "margarin": { amount: 1.8375, unit: "g" },
            "bos": { amount: 1.8375, unit: "g" },
            "garam": { amount: 0.3675, unit: "g" },
            "bakom": { amount: 0.6125, unit: "g" },
            "telur utuh": { amount: 0.0735, unit: "g" },
            "telur kuning": { amount: 0.049, unit: "g" },
            "kacang merah": { amount: 35, unit: "g" },
            "puratos": { amount: 1, unit: "g" }
        },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "sosis label": {
        ingredients: {
            "tepung": { amount: 24.5, unit: "g" },
            "gula pasir": { amount: 3.675, unit: "g" },
            "susu bubuk": { amount: 1.225, unit: "g" },
            "pelembut": { amount: 0.196, unit: "g" },
            "ragi": { amount: 0.3675, unit: "g" },
            "es batu": { amount: 3.675, unit: "g" },
            "air": { amount: 4.9, unit: "g" },
            "skm": { amount: 1.225, unit: "g" },
            "margarin": { amount: 1.8375, unit: "g" },
            "bos": { amount: 1.8375, unit: "g" },
            "garam": { amount: 0.3675, unit: "g" },
            "bakom": { amount: 0.6125, unit: "g" },
            "telur utuh": { amount: 0.0735, unit: "g" },
            "telur kuning": { amount: 0.049, unit: "g" },
            "saos sambal": { amount: 0.5, unit: "g" },
            "saos tomat": { amount: 0.5, unit: "g" },
            "daun bawang": { amount: 0.5, unit: "g" },
            "puratos": { amount: 1, unit: "g" },
            "sosis": { amount: 1, unit: "g" }
        },
        calculation: { divisor: 12, unit: 'loyang' }
    },
    "strawberry almond": {
        ingredients: {
            "tepung": { amount: 24.5, unit: "g" },
            "gula pasir": { amount: 3.675, unit: "g" },
            "susu bubuk": { amount: 1.225, unit: "g" },
            "pelembut": { amount: 0.196, unit: "g" },
            "ragi": { amount: 0.3675, unit: "g" },
            "es batu": { amount: 3.675, unit: "g" },
            "air": { amount: 4.9, unit: "g" },
            "skm": { amount: 1.225, unit: "g" },
            "margarin": { amount: 1.8375, unit: "g" },
            "bos": { amount: 1.8375, unit: "g" },
            "garam": { amount: 0.3675, unit: "g" },
            "bakom": { amount: 0.6125, unit: "g" },
            "telur utuh": { amount: 0.0735, unit: "g" },
            "telur kuning": { amount: 0.049, unit: "g" },
            "selai straw": { amount: 10, unit: "g" },
            "almond": { amount: 15, unit: "g" },
            "white chox": { amount: 15, unit: "g" }
        },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "vanilla oreo": {
        ingredients: {
            "tepung": { amount: 24.5, unit: "g" },
            "gula pasir": { amount: 3.675, unit: "g" },
            "susu bubuk": { amount: 1.225, unit: "g" },
            "pelembut": { amount: 0.196, unit: "g" },
            "ragi": { amount: 0.3675, unit: "g" },
            "es batu": { amount: 3.675, unit: "g" },
            "air": { amount: 4.9, unit: "g" },
            "skm": { amount: 1.225, unit: "g" },
            "margarin": { amount: 1.8375, unit: "g" },
            "bos": { amount: 1.8375, unit: "g" },
            "garam": { amount: 0.3675, unit: "g" },
            "bakom": { amount: 0.6125, unit: "g" },
            "telur utuh": { amount: 0.0735, unit: "g" },
            "telur kuning": { amount: 0.049, unit: "g" },
            "sonton vanilla": { amount: 10, unit: "g" },
            "crumble oreo": { amount: 15, unit: "g" },
            "coklat filling": { amount: 20, unit: "g" },
            "white chox": { amount: 0.5, unit: "g" }
        },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "abon piramid": {
        ingredients: {
            "tepung": { amount: 36.3636, unit: "g" },
            "gula pasir": { amount: 5.5570, unit: "g" },
            "susu bubuk": { amount: 1.8181, unit: "g" },
            "pelembut": { amount: 0.2909, unit: "g" },
            "ragi": { amount: 0.5454, unit: "g" },
            "es batu": { amount: 5.4545, unit: "g" },
            "air": { amount: 7.2727, unit: "g" },
            "skm": { amount: 2.2281, unit: "g" },
            "margarin": { amount: 2.7272, unit: "g" },
            "bos": { amount: 2.7272, unit: "g" },
            "garam": { amount: 0.56077, unit: "g" },
            "bakom": { amount: 0.9090, unit: "g" },
            "telur utuh": { amount: 0.11524, unit: "g" },
            "telur kuning": { amount: 0.07272, unit: "g" },
            "mayonaise": { amount: 0.5, unit: "g" },
            "saos sambal": { amount: 0.5, unit: "g" },
            "saos tomat": { amount: 0.5, unit: "g" },
            "daun bawang": { amount: 0.5, unit: "g" },
            "abon": { amount: 1.5, unit: "g" },
            "puratos": { amount: 0.5, unit: "g" },
            "cuka": { amount: 0.030755, unit: "g" },
            "minyak": { amount: 1.435, unit: "g" }
        },
        calculation: { divisor: 11, unit: 'loyang' }
    },
    "abon roll pedas": {
        ingredients: {
            "tepung": { amount: 33.3333, unit: "g" },
            "gula pasir": { amount: 5.1025, unit: "g" },
            "susu bubuk": { amount: 1.6666, unit: "g" },
            "pelembut": { amount: 0.2666, unit: "g" },
            "ragi": { amount: 0.5, unit: "g" },
            "es batu": { amount: 5, unit: "g" },
            "air": { amount: 6.6666, unit: "g" },
            "skm": { amount: 2.0766, unit: "g" },
            "margarin": { amount: 2.5, unit: "g" },
            "bos": { amount: 2.5, unit: "g" },
            "garam": { amount: 0.51537, unit: "g" },
            "bakom": { amount: 0.8333, unit: "g" },
            "telur utuh": { amount: 0.10615, unit: "g" },
            "telur kuning": { amount: 0.06666, unit: "g" },
            "mayonaise": { amount: 0.5, unit: "g" },
            "saos sambal": { amount: 0.5, unit: "g" },
            "saos tomat": { amount: 0.5, unit: "g" },
            "daun bawang": { amount: 0.5, unit: "g" },
            "abon": { amount: 1.5, unit: "g" },
            "puratos": { amount: 0.5, unit: "g" },
            "cuka": { amount: 0.030755, unit: "g" },
            "minyak": { amount: 1.435, unit: "g" }
        },
        calculation: { divisor: 12, unit: 'loyang' }
    },
    "cheese roll": {
        ingredients: {
            "tepung": { amount: 33.3333, unit: "g" },
            "gula pasir": { amount: 5, unit: "g" },
            "susu bubuk": { amount: 1.6666, unit: "g" },
            "pelembut": { amount: 0.2666, unit: "g" },
            "ragi": { amount: 0.5, unit: "g" },
            "es batu": { amount: 5, unit: "g" },
            "air": { amount: 6.6666, unit: "g" },
            "skm": { amount: 2.5554, unit: "g" },
            "margarin": { amount: 7.833, unit: "g" },
            "bos": { amount: 2.5, unit: "g" },
            "garam": { amount: 0.5, unit: "g" },
            "bakom": { amount: 0.8333, unit: "g" },
            "telur utuh": { amount: 0.1, unit: "g" },
            "telur kuning": { amount: 0.06666, unit: "g" },
            "keju": { amount: 20, unit: "g" },
            "mayonaise": { amount: 0.5, unit: "g" },
            "puratos": { amount: 0.5, unit: "g" },
            "gula halus": { amount: 1.777, unit: "g" }
        },
        calculation: { divisor: 12, unit: 'loyang' }
    },
    "donut paha ayam": {
        ingredients: {
    	    ...donutPahaAyamBase,
    	    "ceres": { amount: 20, unit: "g" },
    	    "tusuk sate": { amount: 1, unit: "pcs" },
    	    "gula halus": { amount: 6, unit: "g" }
        },
        calculation: { divisor: 15, unit: 'loyang' }
    },
    "abon taiwan": {
        ingredients: {
    	    "telur kuning": { amount: 0.5294, unit: "g" },
    	    "garam": { amount: 0.2794, unit: "g" },
    	    "minyak": { amount: 7.5, unit: "g" },
    	    "uht": { amount: 10.44117, unit: "g" },
    	    "tepung": { amount: 10.29411, unit: "g" },
    	    "gula pasir": { amount: 10.44117, unit: "g" },
    	    "putih telur": { amount: 18.75, unit: "g" },
    	    "abon": { amount: 5, unit: "g" },
    	    "mayonaise": { amount: 1.5, unit: "g" },
    	    "wijen putih": { amount: 0.5, unit: "g" },
    	    "wijen hitam": { amount: 0.5, unit: "g" },
    	    "maizena": { amount: 0.29411, unit: "g" },
    	    "everwhip": { amount: 4.70588, unit: "g" }
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
