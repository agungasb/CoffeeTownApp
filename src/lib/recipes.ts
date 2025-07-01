
export interface Ingredient {
    name: string;
    amount: number;
    unit: string;
}

export interface Recipe {
    id: string;
    name: string;
    ingredients: Ingredient[];
    steps: string[];
    baseWeight?: number;
}

export const recipes: Recipe[] = [
    {
        id: "adonan_donut_paha_ayam",
        name: "Adonan Donut Paha Ayam",
        ingredients: [
            { "name": "Tepung", "amount": 500, "unit": "g" },
            { "name": "Premix", "amount": 500, "unit": "g" },
            { "name": "Gula Pasir", "amount": 120, "unit": "g" },
            { "name": "Susu Bubuk", "amount": 50, "unit": "g" },
            { "name": "Ragi", "amount": 15, "unit": "g" },
            { "name": "softer", "amount": 3, "unit": "g" },
            { "name": "telur", "amount": 150, "unit": "g" },
            { "name": "Margarin", "amount": 75, "unit": "g" },
            { "name": "bos", "amount": 75, "unit": "g" },
            { "name": "Garam", "amount": 12, "unit": "g" },
            { "name": "Air", "amount": 150, "unit": "g" },
            { "name": "es batu", "amount": 150, "unit": "g" }
        ],
        steps: [
            "Campurkan bahan kering: tepung, premix, gula, susu bubuk, ragi, softer.",
            "Masukkan telur, air, dan es batu. Uleni hingga setengah kalis.",
            "Tambahkan margarin, BOS, dan garam. Uleni hingga kalis elastis.",
            "Istirahatkan adonan selama 15 menit.",
            "Bagi dan bentuk adonan sesuai selera.",
            "Proofing hingga mengembang dua kali lipat.",
            "Goreng dengan api sedang hingga matang."
        ]
    },
    {
        id: "adonan_roti_manis_roll",
        name: "Adonan Roti Manis Roll",
        ingredients: [
            { "name": "Tepung", "amount": 1000, "unit": "g" },
            { "name": "Gula Pasir", "amount": 150, "unit": "g" },
            { "name": "Susu Bubuk", "amount": 50, "unit": "g" },
            { "name": "pelembut", "amount": 8, "unit": "g" },
            { "name": "Ragi", "amount": 15, "unit": "g" },
            { "name": "es batu", "amount": 150, "unit": "g" },
            { "name": "Air", "amount": 200, "unit": "g" },
            { "name": "skm", "amount": 50, "unit": "g" },
            { "name": "Margarin", "amount": 75, "unit": "g" },
            { "name": "bos", "amount": 75, "unit": "g" },
            { "name": "Garam", "amount": 15, "unit": "g" },
            { "name": "bakom", "amount": 25, "unit": "g" },
            { "name": "telur utuh", "amount": 100, "unit": "g" },
            { "name": "telur kuning", "amount": 75, "unit": "g" }
        ],
        steps: [
            "Campurkan semua bahan kering, aduk rata.",
            "Masukkan bahan basah (kecuali margarin dan garam), uleni hingga setengah kalis.",
            "Masukkan margarin dan garam, uleni hingga kalis elastis.",
            "Fermentasi adonan selama 45-60 menit.",
            "Kempiskan adonan, bagi, dan bentuk sesuai kebutuhan roll.",
            "Proofing akhir selama 30-45 menit.",
            "Panggang di suhu 180°C selama 15-20 menit."
        ]
    },
    {
        id: "adonan_roti_manis_mesin",
        name: "Adonan Roti Manis Mesin",
        ingredients: [
            { "name": "Tepung", "amount": 1000, "unit": "g" },
            { "name": "Gula Pasir", "amount": 150, "unit": "g" },
            { "name": "Susu Bubuk", "amount": 50, "unit": "g" },
            { "name": "pelembut", "amount": 8, "unit": "g" },
            { "name": "Ragi", "amount": 15, "unit": "g" },
            { "name": "es batu", "amount": 150, "unit": "g" },
            { "name": "Air", "amount": 200, "unit": "g" },
            { "name": "skm", "amount": 50, "unit": "g" },
            { "name": "Margarin", "amount": 75, "unit": "g" },
            { "name": "bos", "amount": 75, "unit": "g" },
            { "name": "Garam", "amount": 15, "unit": "g" },
            { "name": "bakom", "amount": 25, "unit": "g" },
            { "name": "telur utuh", "amount": 100, "unit": "g" },
            { "name": "telur kuning", "amount": 75, "unit": "g" }
        ],
        steps: [
            "Masukkan semua bahan ke dalam mixer kecuali margarin dan garam.",
            "Mixer dengan kecepatan rendah hingga tercampur, lalu naikkan kecepatan hingga setengah kalis.",
            "Masukkan margarin dan garam.",
            "Mixer hingga adonan kalis dan elastis (windowpane test).",
            "Lanjutkan ke proses fermentasi dan pembentukan."
        ]
    },
    {
        id: "egg_cream",
        name: "Egg Cream",
        ingredients: [
            { "name": "Gula Pasir", "amount": 1000, "unit": "g" },
            { "name": "telur utuh", "amount": 3000, "unit": "g" },
            { "name": "Garam", "amount": 150, "unit": "g" },
            { "name": "cuka", "amount": 300, "unit": "g" },
            { "name": "lemon", "amount": 1, "unit": "pcs" },
            { "name": "skm", "amount": 4000, "unit": "g" },
            { "name": "minyak", "amount": 14000, "unit": "ml" }
        ],
        steps: [
            "Blender telur, gula, garam, cuka, dan perasan lemon hingga mengembang dan pucat.",
            "Turunkan kecepatan blender, masukkan SKM, aduk rata.",
            "Tuang minyak sedikit demi sedikit sambil terus diblender hingga menjadi mayonaise yang kental.",
            "Simpan di wadah tertutup di dalam kulkas."
        ]
    },
    {
        id: "butter",
        name: "Butter",
        ingredients: [
            { "name": "Margarin", "amount": 6000, "unit": "g" },
            { "name": "gula halus", "amount": 2000, "unit": "g" },
            { "name": "skm", "amount": 1000, "unit": "g" }
        ],
        steps: [
            "Kocok margarin dan gula halus hingga putih dan mengembang.",
            "Masukkan SKM, kocok kembali hingga rata.",
            "Butter cream siap digunakan."
        ]
    },
     {
        id: "butter_donat",
        name: "Butter Donat",
        ingredients: [
            { "name": "Margarin", "amount": 6000, "unit": "g"},
            { "name": "gula halus", "amount": 3000, "unit": "g"},
            { "name": "skm", "amount": 1000, "unit": "g"}
        ],
        steps: [
            "Kocok margarin dan gula halus hingga pucat dan lembut.",
            "Tambahkan SKM dan kocok lagi hingga tercampur sempurna.",
            "Siap digunakan untuk isian atau topping donat."
        ]
    },
    {
        id: "cream_cheese",
        name: "Cream Cheese",
        ingredients: [
            { "name": "Margarin", "amount": 4000, "unit": "g" },
            { "name": "gula halus", "amount": 2000, "unit": "g" },
            { "name": "optimo", "amount": 4000, "unit": "g" }
        ],
        steps: [
            "Kocok margarin dan gula halus hingga mengembang.",
            "Masukkan Optimo, kocok dengan kecepatan tinggi hingga kaku dan stabil.",
            "Cream cheese frosting siap digunakan."
        ]
    },
    {
        id: "topping_maxicana",
        name: "Topping Maxicana",
        ingredients: [
            { "name": "Tepung", "amount": 3600, "unit": "g" },
            { "name": "maizena", "amount": 500, "unit": "g" },
            { "name": "gula halus", "amount": 3000, "unit": "g" },
            { "name": "Margarin", "amount": 3000, "unit": "g" },
            { "name": "putih telur", "amount": 3000, "unit": "g" }
        ],
        steps: [
            "Kocok margarin dan gula halus hingga lembut.",
            "Masukkan putih telur sedikit demi sedikit, kocok hingga rata.",
            "Ayak tepung dan maizena, masukkan ke dalam adonan, aduk perlahan hingga tercampur.",
            "Masukkan ke dalam piping bag, siap digunakan untuk topping."
        ]
    },
    {
        id: "coklat_ganache",
        name: "Coklat Ganache",
        ingredients: [
            { "name": "dark chox", "amount": 5000, "unit": "g" },
            { "name": "uht", "amount": 1000, "unit": "g" }
        ],
        steps: [
            "Panaskan UHT hingga muncul gelembung kecil di pinggir (jangan sampai mendidih).",
            "Siramkan UHT panas ke potongan dark compound chocolate.",
            "Diamkan selama 5 menit, lalu aduk perlahan dari tengah hingga menjadi ganache yang halus dan mengkilap."
        ]
    },
    {
        id: "adonan_abon_taiwan",
        name: "Adonan Abon Taiwan",
        ingredients: [
            { "name": "telur kuning", "amount": 100, "unit": "g" },
            { "name": "Garam", "amount": 1, "unit": "g" },
            { "name": "minyak", "amount": 30, "unit": "g" },
            { "name": "uht", "amount": 30, "unit": "g" },
            { "name": "tepung", "amount": 40, "unit": "g" },
            { "name": "Gula Pasir", "amount": 40, "unit": "g" },
            { "name": "putih telur", "amount": 75, "unit": "g" }
        ],
        steps: [
            "Buat adonan pasta: aduk rata kuning telur, garam, minyak, susu UHT, dan tepung.",
            "Buat adonan meringue: kocok putih telur hingga berbusa, masukkan gula pasir bertahap, kocok hingga soft peak.",
            "Campurkan meringue ke dalam adonan pasta secara bertahap, aduk lipat dengan spatula.",
            "Tuang ke loyang yang sudah dialasi kertas roti.",
            "Panggang hingga matang."
        ]
    },
    {
        id: "fla_abon_taiwan",
        name: "Fla Abon Taiwan",
        ingredients: [
            { "name": "telur kuning", "amount": 50, "unit": "g" },
            { "name": "Garam", "amount": 1, "unit": "g" },
            { "name": "maizena", "amount": 10, "unit": "g" },
            { "name": "uht", "amount": 100, "unit": "g" },
            { "name": "tepung", "amount": 10, "unit": "g" },
            { "name": "Gula Pasir", "amount": 15, "unit": "g" },
            { "name": "everwhip", "amount": 167, "unit": "g" }
        ],
        steps: [
            "Masak semua bahan kecuali Everwhip hingga meletup-letup, dinginkan.",
            "Kocok Everwhip hingga kaku.",
            "Campurkan adonan yang sudah dingin ke dalam whipped cream, aduk rata.",
            "Fla siap digunakan."
        ]
    },
    {
        id: "adonan_donat_joko",
        name: "Adonan Donat Joko",
        ingredients: [
            { "name": "Tepung Gerbang", "amount": 714.2857143, "unit": "g" },
            { "name": "Premix", "amount": 285.7142857, "unit": "g" },
            { "name": "Gula Pasir", "amount": 120, "unit": "g" },
            { "name": "Susu Bubuk", "amount": 50, "unit": "g" },
            { "name": "Ragi", "amount": 14.28571429, "unit": "g" },
            { "name": "Softer", "amount": 2.571428571, "unit": "g" },
            { "name": "Telur", "amount": 100, "unit": "g" },
            { "name": "Margarin", "amount": 75, "unit": "g" },
            { "name": "Bos", "amount": 75, "unit": "g" },
            { "name": "Garam", "amount": 14.28571429, "unit": "g" },
            { "name": "Air", "amount": 171.42857145, "unit": "g" },
            { "name": "Es Batu", "amount": 171.42857145, "unit": "g" }
        ],
        steps: [
            "Campurkan semua bahan kering (tepung, premix, gula, susu, ragi, softer) dalam mangkuk mixer. Aduk rata.",
            "Tambahkan telur, air, dan es batu. Uleni dengan kecepatan rendah hingga adonan menyatu.",
            "Naikkan kecepatan mixer dan uleni hingga adonan setengah kalis.",
            "Masukkan margarin, BOS, dan garam. Lanjutkan menguleni hingga adonan kalis dan elastis (windowpane test).",
            "Istirahatkan adonan selama 30 menit atau hingga mengembang.",
            "Kempiskan adonan, bagi dan bulatkan sesuai berat yang diinginkan.",
            "Proofing akhir hingga mengembang dua kali lipat, sekitar 45-60 menit.",
            "Goreng donat dalam minyak panas dengan api sedang hingga kedua sisi berwarna keemasan."
        ]
    }
];
