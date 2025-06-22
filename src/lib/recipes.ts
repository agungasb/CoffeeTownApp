export interface Ingredient {
    name: string;
    amount: number;
    unit: string;
}

export interface Recipe {
    id: string;
    name: string;
    ingredients: Ingredient[];
}

export const recipes: Recipe[] = [
    {
        id: "adonan_donut_paha_ayam",
        name: "Adonan Donut Paha Ayam",
        ingredients: [
            { "name": "Tepung", "amount": 500, "unit": "grams" },
            { "name": "Premix", "amount": 500, "unit": "grams" },
            { "name": "Gula Pasir", "amount": 120, "unit": "grams" },
            { "name": "Susu Bubuk", "amount": 50, "unit": "grams" },
            { "name": "Ragi", "amount": 15, "unit": "grams" },
            { "name": "Softer", "amount": 3, "unit": "grams" },
            { "name": "Telur", "amount": 3, "unit": "butir" },
            { "name": "Margarin", "amount": 75, "unit": "grams" },
            { "name": "BOS", "amount": 75, "unit": "grams" },
            { "name": "Garam", "amount": 12, "unit": "grams" },
            { "name": "Air", "amount": 150, "unit": "grams" },
            { "name": "Es Batu", "amount": 150, "unit": "grams" }
        ]
    },
    {
        id: "adonan_roti_manis_roll",
        name: "Adonan Roti Manis Roll",
        ingredients: [
            { "name": "Tepung", "amount": 1000, "unit": "grams" },
            { "name": "Gula Pasir", "amount": 150, "unit": "grams" },
            { "name": "Susu Bubuk", "amount": 50, "unit": "grams" },
            { "name": "Pelembut", "amount": 8, "unit": "grams" },
            { "name": "Ragi", "amount": 15, "unit": "grams" },
            { "name": "Es Batu", "amount": 150, "unit": "grams" },
            { "name": "Air", "amount": 200, "unit": "grams" },
            { "name": "SKM", "amount": 50, "unit": "grams" },
            { "name": "Margarin", "amount": 75, "unit": "grams" },
            { "name": "BOS", "amount": 75, "unit": "grams" },
            { "name": "Garam", "amount": 15, "unit": "grams" },
            { "name": "Bakom", "amount": 25, "unit": "grams" },
            { "name": "Telur Utuh", "amount": 2, "unit": "butir" },
            { "name": "Telur Kuning", "amount": 75, "unit": "grams" }
        ]
    },
    {
        id: "adonan_roti_manis_mesin",
        name: "Adonan Roti Manis Mesin",
        ingredients: [
            { "name": "Tepung", "amount": 1000, "unit": "grams" },
            { "name": "Gula Pasir", "amount": 150, "unit": "grams" },
            { "name": "Susu Bubuk", "amount": 50, "unit": "grams" },
            { "name": "Pelembut", "amount": 8, "unit": "grams" },
            { "name": "Ragi", "amount": 15, "unit": "grams" },
            { "name": "Es Batu", "amount": 150, "unit": "grams" },
            { "name": "Air", "amount": 200, "unit": "grams" },
            { "name": "SKM", "amount": 50, "unit": "grams" },
            { "name": "Margarin", "amount": 75, "unit": "grams" },
            { "name": "BOS", "amount": 75, "unit": "grams" },
            { "name": "Garam", "amount": 15, "unit": "grams" },
            { "name": "Bakom", "amount": 25, "unit": "grams" },
            { "name": "Telur Utuh", "amount": 2, "unit": "butir" },
            { "name": "Telur Kuning", "amount": 75, "unit": "grams" }
        ]
    },
    {
        id: "egg_cream",
        name: "Egg Cream",
        ingredients: [
            { "name": "Gula Pasir", "amount": 1000, "unit": "grams" },
            { "name": "Telur", "amount": 60, "unit": "butir" },
            { "name": "Garam", "amount": 150, "unit": "grams" },
            { "name": "Cuka", "amount": 300, "unit": "grams" },
            { "name": "Lemon", "amount": 1, "unit": "buah" },
            { "name": "SKM", "amount": 4000, "unit": "grams" },
            { "name": "Minyak", "amount": 14000, "unit": "ml" }
        ]
    },
    {
        id: "butter",
        name: "Butter",
        ingredients: [
            { "name": "Margarin", "amount": 6000, "unit": "grams" },
            { "name": "Gula Halus", "amount": 2000, "unit": "grams" },
            { "name": "SKM", "amount": 1000, "unit": "grams" }
        ]
    },
     {
        id: "butter_donat",
        name: "Butter Donat",
        ingredients: [
            { "name": "Margarin", "amount": 6000, "unit": "grams"},
            { "name": "Gula Halus", "amount": 3000, "unit": "grams"},
            { "name": "SKM", "amount": 1000, "unit": "grams"}
        ]
    },
    {
        id: "cream_cheese",
        name: "Cream Cheese",
        ingredients: [
            { "name": "Margarin", "amount": 4000, "unit": "grams" },
            { "name": "Gula Halus", "amount": 2000, "unit": "grams" },
            { "name": "Optimo", "amount": 4000, "unit": "grams" }
        ]
    },
    {
        id: "topping_maxicana",
        name: "Topping Maxicana",
        ingredients: [
            { "name": "Tepung", "amount": 3600, "unit": "grams" },
            { "name": "Maizena", "amount": 500, "unit": "grams" },
            { "name": "Gula Halus", "amount": 3000, "unit": "grams" },
            { "name": "Margarin", "amount": 3000, "unit": "grams" },
            { "name": "Putih Telur", "amount": 3000, "unit": "grams" }
        ]
    },
    {
        id: "coklat_ganache",
        name: "Coklat Ganache",
        ingredients: [
            { "name": "Compound Dark", "amount": 5000, "unit": "grams" },
            { "name": "UHT", "amount": 1000, "unit": "grams" }
        ]
    },
    {
        id: "adonan_abon_taiwan",
        name: "Adonan Abon Taiwan",
        ingredients: [
            { "name": "Telur Kuning", "amount": 2, "unit": "butir" },
            { "name": "Garam", "amount": 1, "unit": "grams" },
            { "name": "Minyak", "amount": 30, "unit": "grams" },
            { "name": "Susu UHT", "amount": 30, "unit": "grams" },
            { "name": "Tepung Segitiga", "amount": 40, "unit": "grams" },
            { "name": "Gula Pasir", "amount": 40, "unit": "grams" },
            { "name": "Putih Telur", "amount": 75, "unit": "grams" }
        ]
    },
    {
        id: "fla_abon_taiwan",
        name: "Fla Abon Taiwan",
        ingredients: [
            { "name": "Telur Kuning", "amount": 1, "unit": "butir" },
            { "name": "Garam", "amount": 1, "unit": "grams" },
            { "name": "Maizena", "amount": 10, "unit": "grams" },
            { "name": "Susu UHT", "amount": 100, "unit": "grams" },
            { "name": "Tepung Segitiga", "amount": 10, "unit": "grams" },
            { "name": "Gula Pasir", "amount": 15, "unit": "grams" },
            { "name": "Everwhip", "amount": 167, "unit": "grams" }
        ]
    },
    {
        id: "adonan_donat_joko",
        name: "Adonan Donat Joko",
        ingredients: [
            { "name": "Tepung Gerbang", "amount": 714.2857143, "unit": "grams" },
            { "name": "Premix", "amount": 285.7142857, "unit": "grams" },
            { "name": "Gula Pasir", "amount": 120, "unit": "grams" },
            { "name": "Susu Bubuk", "amount": 50, "unit": "grams" },
            { "name": "Ragi", "amount": 14.28571429, "unit": "grams" },
            { "name": "Softer", "amount": 2.571428571, "unit": "grams" },
            { "name": "Telur", "amount": 2, "unit": "butir" },
            { "name": "Margarin", "amount": 75, "unit": "grams" },
            { "name": "BOS", "amount": 75, "unit": "grams" },
            { "name": "Garam", "amount": 14.28571429, "unit": "grams" },
            { "name": "Air", "amount": 171.42857145, "unit": "grams" },
            { "name": "Es Batu", "amount": 171.42857145, "unit": "grams" }
        ]
    },
    {
        id: "adonan_roti_sobek",
        name: "Adonan Roti Sobek",
        ingredients: [
            { "name": "Tepung Gerbang", "amount": 1000, "unit": "grams" },
            { "name": "Gula Pasir", "amount": 200, "unit": "grams" },
            { "name": "Telur", "amount": 1, "unit": "butir" },
            { "name": "Susu Bubuk", "amount": 20, "unit": "grams" },
            { "name": "Ragi", "amount": 13, "unit": "grams" },
            { "name": "Pelembut", "amount": 5, "unit": "grams" },
            { "name": "Calsium", "amount": 4, "unit": "grams" },
            { "name": "Ecosoft", "amount": 35, "unit": "grams" },
            { "name": "Margarin", "amount": 50, "unit": "grams" },
            { "name": "Garam", "amount": 15, "unit": "grams" },
            { "name": "Air", "amount": 300, "unit": "grams" },
            { "name": "Es Batu", "amount": 150, "unit": "grams" }
        ]
    },
    {
        id: "adonan_roti_sobek_coklat",
        name: "Adonan Roti Sobek Coklat",
        ingredients: [
            { "name": "Tepung Gerbang", "amount": 1040, "unit": "grams" },
            { "name": "Gula Pasir", "amount": 260, "unit": "grams" },
            { "name": "Telur", "amount": 1, "unit": "butir" },
            { "name": "Coklat Bubuk", "amount": 60, "unit": "grams" },
            { "name": "Ragi", "amount": 23, "unit": "grams" },
            { "name": "Pelembut", "amount": 4, "unit": "grams" },
            { "name": "Calsium", "amount": 2, "unit": "grams" },
            { "name": "UHT", "amount": 200, "unit": "grams" },
            { "name": "Margarin", "amount": 160, "unit": "grams" },
            { "name": "Garam", "amount": 8, "unit": "grams" },
            { "name": "Air", "amount": 200, "unit": "grams" },
            { "name": "Es Batu", "amount": 150, "unit": "grams" }
        ]
    },
    {
        id: "adonan_butter_balok_mocha",
        name: "Adonan Butter Balok Mocha",
        ingredients: [
            { "name": "Margarin", "amount": 6000, "unit": "grams" },
            { "name": "Gula Halus", "amount": 2000, "unit": "grams" },
            { "name": "SKM", "amount": 1000, "unit": "grams" },
            { "name": "Coklat Filling", "amount": 1000, "unit": "grams" }
        ]
    },
    {
        id: "adonan_brownies",
        name: "Adonan Brownies",
        ingredients: [
            { "name": "Tepung Brownies", "amount": 366.6666667, "unit": "grams" },
            { "name": "Telur Ayam", "amount": 1.666666667, "unit": "butir" },
            { "name": "Minyak", "amount": 208.3333333, "unit": "grams" },
            { "name": "Air", "amount": 45.83333333, "unit": "grams" }
        ]
    },
    {
        id: "adonan_banana_cake",
        name: "Adonan Banana Cake",
        ingredients: [
            { "name": "Tepung Segitiga", "amount": 281.25, "unit": "grams" },
            { "name": "Pisang", "amount": 281.25, "unit": "grams" },
            { "name": "Gula Pasir", "amount": 281.25, "unit": "grams" },
            { "name": "Baking Powder", "amount": 5, "unit": "grams" },
            { "name": "Soda Kue", "amount": 5, "unit": "grams" },
            { "name": "Margarin", "amount": 87.5, "unit": "grams" },
            { "name": "Minyak", "amount": 62.5, "unit": "grams" },
            { "name": "Telur Ayam", "amount": 3, "unit": "butir" },
            { "name": "UHT", "amount": 125, "unit": "grams" }
        ]
    },
    {
        id: "adonan_banana_cake_pandan",
        name: "Adonan Banana Cake Pandan",
        ingredients: [
            { "name": "Tepung Segitiga", "amount": 281.25, "unit": "grams" },
            { "name": "Pisang", "amount": 281.25, "unit": "grams" },
            { "name": "Gula Pasir", "amount": 281.25, "unit": "grams" },
            { "name": "Baking Powder", "amount": 5, "unit": "grams" },
            { "name": "Soda Kue", "amount": 5, "unit": "grams" },
            { "name": "Margarin", "amount": 87.5, "unit": "grams" },
            { "name": "Minyak", "amount": 62.5, "unit": "grams" },
            { "name": "Telur Ayam", "amount": 3, "unit": "butir" },
            { "name": "UHT", "amount": 125, "unit": "grams" },
            { "name": "Pasta Pandan", "amount": 10, "unit": "grams" }
        ]
    },
    {
        id: "adonan_chiffon",
        name: "Adonan Chiffon",
        ingredients: [
            { "name": "Tepung Chiffon Premix", "amount": 142.8571429, "unit": "grams" },
            { "name": "Telur Ayam", "amount": 3.142857143, "unit": "butir" },
            { "name": "Minyak", "amount": 7.142857143, "unit": "grams" },
            { "name": "Pasta Pandan/Mocha", "amount": 4.285714286, "unit": "grams" },
            { "name": "Air", "amount": 7.142857143, "unit": "grams" }
        ]
    },
    {
        id: "adonan_bolu_gulung",
        name: "Adonan Bolu Gulung",
        ingredients: [
            { "name": "Tepung Segitiga", "amount": 150, "unit": "grams" },
            { "name": "Gula Pasir", "amount": 150, "unit": "grams" },
            { "name": "SP", "amount": 37.5, "unit": "grams" },
            { "name": "Susu Bubuk", "amount": 25, "unit": "grams" },
            { "name": "Maizena", "amount": 25, "unit": "grams" },
            { "name": "Telur Ayam", "amount": 10, "unit": "butir" },
            { "name": "Margarin", "amount": 150, "unit": "grams" }
        ]
    },
    {
        id: "adonan_muffin",
        name: "Adonan Muffin",
        ingredients: [
            { "name": "Tepung Muffin", "amount": 38.67924528, "unit": "grams" },
            { "name": "Telur Ayam", "amount": 0.301886792, "unit": "butir" },
            { "name": "Minyak", "amount": 15.28301887, "unit": "grams" },
            { "name": "Air", "amount": 15.28301887, "unit": "grams" }
        ]
    },
    {
        id: "adonan_roti_tawar",
        name: "Adonan Roti Tawar",
        ingredients: [
            { "name": "Tepung Gerbang", "amount": 1000, "unit": "grams" },
            { "name": "Gula Pasir", "amount": 120, "unit": "grams" },
            { "name": "Susu Bubuk", "amount": 30, "unit": "grams" },
            { "name": "S500", "amount": 10, "unit": "grams" },
            { "name": "Garam", "amount": 15, "unit": "grams" },
            { "name": "Butter", "amount": 100, "unit": "grams" },
            { "name": "Ragi", "amount": 15, "unit": "grams" },
            { "name": "Pelembut", "amount": 5, "unit": "grams" },
            { "name": "Es Batu", "amount": 150, "unit": "grams" },
            { "name": "Air", "amount": 300, "unit": "grams" }
        ]
    }
];
