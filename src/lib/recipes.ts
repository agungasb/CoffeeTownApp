
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
            { "name": "Gula Pasir", "amount": 1000, "unit": "grams" },
            { "name": "Telur", "amount": 60, "unit": "butir" },
            { "name": "Garam", "amount": 150, "unit": "grams" },
            { "name": "Cuka", "amount": 300, "unit": "grams" },
            { "name": "Lemon", "amount": 1, "unit": "buah" },
            { "name": "SKM", "amount": 4000, "unit": "grams" },
            { "name": "Minyak", "amount": 14000, "unit": "ml" }
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
            { "name": "Margarin", "amount": 6000, "unit": "grams" },
            { "name": "Gula Halus", "amount": 2000, "unit": "grams" },
            { "name": "SKM", "amount": 1000, "unit": "grams" }
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
            { "name": "Margarin", "amount": 6000, "unit": "grams"},
            { "name": "Gula Halus", "amount": 3000, "unit": "grams"},
            { "name": "SKM", "amount": 1000, "unit": "grams"}
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
            { "name": "Margarin", "amount": 4000, "unit": "grams" },
            { "name": "Gula Halus", "amount": 2000, "unit": "grams" },
            { "name": "Optimo", "amount": 4000, "unit": "grams" }
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
            { "name": "Tepung", "amount": 3600, "unit": "grams" },
            { "name": "Maizena", "amount": 500, "unit": "grams" },
            { "name": "Gula Halus", "amount": 3000, "unit": "grams" },
            { "name": "Margarin", "amount": 3000, "unit": "grams" },
            { "name": "Putih Telur", "amount": 3000, "unit": "grams" }
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
            { "name": "Compound Dark", "amount": 5000, "unit": "grams" },
            { "name": "UHT", "amount": 1000, "unit": "grams" }
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
            { "name": "Telur Kuning", "amount": 2, "unit": "butir" },
            { "name": "Garam", "amount": 1, "unit": "grams" },
            { "name": "Minyak", "amount": 30, "unit": "grams" },
            { "name": "Susu UHT", "amount": 30, "unit": "grams" },
            { "name": "Tepung Segitiga", "amount": 40, "unit": "grams" },
            { "name": "Gula Pasir", "amount": 40, "unit": "grams" },
            { "name": "Putih Telur", "amount": 75, "unit": "grams" }
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
            { "name": "Telur Kuning", "amount": 1, "unit": "butir" },
            { "name": "Garam", "amount": 1, "unit": "grams" },
            { "name": "Maizena", "amount": 10, "unit": "grams" },
            { "name": "Susu UHT", "amount": 100, "unit": "grams" },
            { "name": "Tepung Segitiga", "amount": 10, "unit": "grams" },
            { "name": "Gula Pasir", "amount": 15, "unit": "grams" },
            { "name": "Everwhip", "amount": 167, "unit": "grams" }
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
        ],
        steps: [
            "Campur semua bahan kering (tepung, gula, susu bubuk, ragi, pelembut, calsium, ecosoft) dalam mixer.",
            "Tambahkan telur, air, dan es batu. Uleni hingga setengah kalis.",
            "Masukkan margarin dan garam, uleni hingga kalis elastis.",
            "Lakukan fermentasi pertama (bulk fermentation) selama 60 menit atau hingga mengembang dua kali lipat.",
            "Kempiskan adonan, timbang dan bagi menjadi beberapa bagian sama besar. Bulatkan.",
            "Susun adonan dalam loyang yang sudah diolesi margarin.",
            "Lakukan fermentasi kedua (proofing) selama 60-90 menit hingga mengembang penuh.",
            "Panggang dalam oven yang sudah dipanaskan pada suhu 180°C selama 20-25 menit."
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
        ],
        steps: [
            "Campur semua bahan kering (tepung, gula, coklat bubuk, ragi, pelembut, calsium) dalam mixer.",
            "Tambahkan telur, UHT, air, dan es batu. Uleni hingga setengah kalis.",
            "Masukkan margarin dan garam, uleni hingga kalis elastis.",
            "Fermentasi adonan selama 60 menit atau hingga mengembang.",
            "Bagi adonan, bulatkan, dan susun dalam loyang.",
            "Proofing akhir selama 60-90 menit.",
            "Panggang pada suhu 180°C selama 20-25 menit hingga matang."
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
        ],
        steps: [
            "Kocok margarin dan gula halus dengan mixer hingga lembut, putih, dan mengembang.",
            "Turunkan kecepatan mixer, masukkan SKM dan coklat filling.",
            "Kocok kembali hingga semua bahan tercampur rata dan menjadi buttercream yang halus.",
            "Siap digunakan untuk olesan atau isian."
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
        ],
        steps: [
            "Panaskan oven pada suhu 175°C. Siapkan loyang dan alasi dengan kertas roti.",
            "Dalam sebuah mangkuk, kocok telur, minyak, dan air hingga tercampur.",
            "Masukkan tepung brownies premix ke dalam campuran basah.",
            "Aduk dengan spatula hanya sampai tercampur rata. Jangan mengaduk berlebihan.",
            "Tuang adonan ke dalam loyang yang sudah disiapkan dan ratakan permukaannya.",
            "Panggang selama 25-30 menit atau hingga matang (tes tusuk).",
            "Keluarkan dari oven dan dinginkan sebelum dipotong."
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
        ],
        steps: [
            "Panaskan oven 180°C. Siapkan loyang, olesi dengan margarin dan taburi tepung.",
            "Lumatkan pisang dengan garpu. Sisihkan.",
            "Ayak bersamaan tepung, baking powder, dan soda kue. Sisihkan.",
            "Kocok margarin dan gula pasir hingga lembut dan pucat.",
            "Masukkan telur satu per satu sambil terus dikocok hingga mengembang.",
            "Masukkan pisang lumat, aduk rata.",
            "Secara bergantian, masukkan campuran tepung dan susu UHT, aduk perlahan hingga rata.",
            "Terakhir, masukkan minyak dan aduk lipat dengan spatula hingga homogen.",
            "Tuang adonan ke loyang dan panggang selama 40-45 menit."
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
        ],
        steps: [
            "Panaskan oven 180°C. Siapkan loyang, olesi dengan margarin dan taburi tepung.",
            "Lumatkan pisang dengan garpu. Sisihkan.",
            "Ayak bersamaan tepung, baking powder, dan soda kue.",
            "Kocok margarin dan gula pasir hingga lembut.",
            "Masukkan telur satu per satu sambil terus dikocok.",
            "Masukkan pisang lumat dan pasta pandan, aduk rata.",
            "Secara bergantian, masukkan campuran tepung dan susu UHT, aduk perlahan.",
            "Masukkan minyak dan aduk lipat hingga homogen.",
            "Tuang adonan ke loyang dan panggang selama 40-45 menit."
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
        ],
        steps: [
            "Panaskan oven. Siapkan loyang chiffon tanpa diolesi apapun.",
            "Pisahkan kuning dan putih telur.",
            "Campurkan tepung chiffon premix, kuning telur, minyak, air, dan pasta. Aduk rata hingga menjadi adonan pasta yang licin.",
            "Di wadah terpisah, kocok putih telur hingga berbusa, lalu masukkan gula (jika tidak termasuk premix) secara bertahap. Kocok hingga kaku (stiff peak).",
            "Secara bertahap, masukkan adonan putih telur ke dalam adonan pasta, aduk lipat dengan spatula hingga homogen.",
            "Tuang adonan ke dalam loyang chiffon.",
            "Panggang hingga matang. Setelah matang, segera balikkan loyang dan dinginkan dalam posisi terbalik."
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
        ],
        steps: [
            "Panaskan oven. Siapkan loyang bolu gulung, olesi margarin dan alasi kertas roti.",
            "Lelehkan margarin, biarkan dingin.",
            "Kocok telur, gula pasir, dan SP dengan kecepatan tinggi hingga mengembang, kental, dan berjejak.",
            "Turunkan kecepatan mixer. Masukkan campuran tepung, susu bubuk, dan maizena yang sudah diayak. Aduk sebentar hingga rata.",
            "Masukkan margarin leleh, aduk lipat dengan spatula hingga benar-benar tercampur rata.",
            "Tuang adonan ke dalam loyang, ratakan. Panggang selama 15-20 menit atau hingga matang.",
            "Setelah matang, balikkan kue ke atas serbet bersih. Olesi dengan selai dan gulung selagi hangat."
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
        ],
        steps: [
            "Panaskan oven. Siapkan cetakan muffin dan beri paper cup.",
            "Dalam mangkuk, campurkan telur, minyak, dan air. Aduk dengan whisk.",
            "Masukkan tepung muffin premix. Aduk secukupnya, jangan berlebihan. Biarkan adonan sedikit bergerindil.",
            "Tuang adonan ke dalam paper cup hingga 3/4 penuh.",
            "Panggang dalam oven selama 20-25 menit atau hingga matang.",
            "Lakukan tes tusuk untuk memastikan kematangan."
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
        ],
        steps: [
            "Campurkan semua bahan kering (tepung, gula, susu bubuk, S500, ragi, pelembut) di dalam mixer.",
            "Tambahkan air dan es batu, uleni hingga setengah kalis.",
            "Masukkan butter dan garam. Lanjutkan menguleni hingga adonan sangat kalis dan elastis (windowpane test).",
            "Fermentasi adonan (bulk) selama sekitar 45-60 menit.",
            "Kempiskan adonan, timbang, dan bentuk menjadi gulungan padat.",
            "Letakkan adonan di dalam loyang roti tawar yang sudah diolesi margarin.",
            "Proofing hingga adonan mencapai 3/4 tinggi loyang.",
            "Tutup loyang dan panggang dalam oven yang sudah dipanaskan pada suhu 190°C selama 30-35 menit."
        ]
    }
];
