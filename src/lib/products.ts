
export const productDepartments = {
    rotiManis: [
        "abon ayam pedas", 
        "abon piramid", 
        "abon roll pedas", 
        "abon sosis", 
        "cheese roll", 
        "cream choco cheese",
        "donut paha ayam", 
        "double coklat", 
        "hot sosis", 
        "kacang merah", 
        "maxicana coklat", 
        "red velvet cream cheese",
        "sosis label", 
        "strawberry almond", 
        "vanilla oreo", 
        "abon taiwan"
    ],
    donut: [
        "Donut Almond",
        "Donut Coklat Ceres",
        "Donut Coklat Kacang",
        "Donut Gula Halus",
        "Donut Keju",
        "Donut Oreo",
        "7K BOMBOLONI CAPPUCINO",
        "7K BOMBOLONI DARK COKLAT",
        "7K BOMBOLONI GREENTEA",
        "7K BOMBOLONI TIRAMISU",
    ],
    rotiSobek: [
        "Roti Sobek Coklat",
        "Roti Sobek Double Coklat",
        "Roti Sobek Durian",
        "Roti Sobek Keju",
        "Roti Sobek Srikaya",
        "Roti Sobek Srikaya Pandan",
        "Roti Sobek Vanilla",
        "Roti Balok Choco Mocha",
        "Roti Balok Cream Cheese"
    ],
    bolu: [
        "Banana Choco",
        "Banana Pandan Cheese",
        "Bolu Gulung Blueberry",
        "Bolu Gulung Keju",
        "Brownies",
        "Chiffon Mocha",
        "Chiffon Pandan",
        "Muffin Coklat",
        "Muffin Vanilla",
        "Bolu Coklat"
    ]
};

export const allProductItems = [
    ...productDepartments.rotiManis,
    ...productDepartments.donut,
    ...productDepartments.rotiSobek,
    ...productDepartments.bolu
];
