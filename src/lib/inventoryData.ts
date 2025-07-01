
export interface InventoryItem {
    id: string;
    name: string;
    currentStock: number;
    minimumStock: number;
    unit: string;
    orderUnit?: string;
    orderUnitConversion?: number;
    department: 'rotiManis' | 'donut' | 'rotiSobek';
}

export const inventoryData: InventoryItem[] = [
    // Roti Manis Department
    { id: "ing-1", name: "abon", currentStock: 1800, minimumStock: 1000, unit: "g", department: "rotiManis" },
    { id: "ing-2", name: "air", currentStock: 0, minimumStock: 0, unit: "g", department: "rotiManis" },
    { id: "ing-3", name: "almond", currentStock: 0, minimumStock: 0, unit: "g", department: "rotiManis" },
    { id: "ing-4", name: "bakom", currentStock: 0, minimumStock: 0, unit: "g", department: "rotiManis" },
    { id: "ing-5", name: "bos", currentStock: 0, minimumStock: 0, unit: "g", department: "rotiManis" },
    { id: "ing-6", name: "ceres", currentStock: 3000, minimumStock: 2000, unit: "g", orderUnit: "dus", orderUnitConversion: 12000, department: "rotiManis" },
    { id: "ing-7", name: "coklat filling", currentStock: 900, minimumStock: 1500, unit: "g", department: "rotiManis" },
    { id: "ing-8", name: "crumble oreo", currentStock: 0, minimumStock: 0, unit: "g", department: "rotiManis" },
    { id: "ing-9", name: "crumble velvet", currentStock: 0, minimumStock: 0, unit: "g", department: "rotiManis" },
    { id: "ing-10", name: "cuka", currentStock: 0, minimumStock: 0, unit: "g", department: "rotiManis" },
    { id: "ing-11", name: "dark chox", currentStock: 0, minimumStock: 0, unit: "g", department: "rotiManis" },
    { id: "ing-12", name: "daun bawang", currentStock: 150, minimumStock: 200, unit: "g", department: "rotiManis" },
    { id: "ing-13", name: "es batu", currentStock: 0, minimumStock: 0, unit: "g", department: "rotiManis" },
    { id: "ing-14", name: "everwhip", currentStock: 0, minimumStock: 0, unit: "g", department: "rotiManis" },
    { id: "ing-15", name: "garam", currentStock: 1200, minimumStock: 500, unit: "g", department: "rotiManis" },
    { id: "ing-16", name: "gula halus", currentStock: 0, minimumStock: 0, unit: "g", department: "rotiManis" },
    { id: "ing-17", name: "gula pasir", currentStock: 15000, minimumStock: 5000, unit: "g", orderUnit: "sak", orderUnitConversion: 50000, department: "rotiManis" },
    { id: "ing-18", name: "kacang merah", currentStock: 0, minimumStock: 0, unit: "g", department: "rotiManis" },
    { id: "ing-19", name: "keju", currentStock: 2200, minimumStock: 1000, unit: "g", orderUnit: "dus", orderUnitConversion: 24000, department: "rotiManis" },
    { id: "ing-20", name: "maizena", currentStock: 0, minimumStock: 0, unit: "g", department: "rotiManis" },
    { id: "ing-21", name: "margarin", currentStock: 8000, minimumStock: 4000, unit: "g", orderUnit: "dus", orderUnitConversion: 15000, department: "rotiManis" },
    { id: "ing-22", name: "mayonaise", currentStock: 1400, minimumStock: 1000, unit: "g", department: "rotiManis" },
    { id: "ing-23", name: "minyak", currentStock: 0, minimumStock: 0, unit: "g", department: "rotiManis" },
    { id: "ing-24", name: "optimo", currentStock: 0, minimumStock: 0, unit: "g", department: "rotiManis" },
    { id: "ing-25", name: "pelembut", currentStock: 0, minimumStock: 0, unit: "g", department: "rotiManis" },
    { id: "ing-26", name: "premix", currentStock: 0, minimumStock: 5000, unit: "g", department: "rotiManis" },
    { id: "ing-27", name: "puratos", currentStock: 0, minimumStock: 0, unit: "g", department: "rotiManis" },
    { id: "ing-28", name: "putih telur", currentStock: 0, minimumStock: 0, unit: "g", department: "rotiManis" },
    { id: "ing-29", name: "ragi", currentStock: 800, minimumStock: 500, unit: "g", orderUnit: "dus", orderUnitConversion: 10000, department: "rotiManis" },
    { id: "ing-30", name: "saos sambal", currentStock: 800, minimumStock: 1000, unit: "g", department: "rotiManis" },
    { id: "ing-31", name: "saos tomat", currentStock: 0, minimumStock: 0, unit: "g", department: "rotiManis" },
    { id: "ing-32", name: "selai straw", currentStock: 0, minimumStock: 0, unit: "g", department: "rotiManis" },
    { id: "ing-33", name: "skm", currentStock: 0, minimumStock: 0, unit: "g", department: "rotiManis" },
    { id: "ing-34", name: "sonton vanilla", currentStock: 0, minimumStock: 0, unit: "g", department: "rotiManis" },
    { id: "ing-35", name: "sosis", currentStock: 400, minimumStock: 200, unit: "pcs", orderUnit: "pack", orderUnitConversion: 28, department: "rotiManis" },
    { id: "ing-36", name: "susu bubuk", currentStock: 4500, minimumStock: 2000, unit: "g", orderUnit: "dus", orderUnitConversion: 25000, department: "rotiManis" },
    { id: "ing-37", name: "telur kuning", currentStock: 0, minimumStock: 0, unit: "g", department: "rotiManis" },
    { id: "ing-38", name: "telur utuh", currentStock: 150, minimumStock: 60, unit: "g", department: "rotiManis" },
    { id: "ing-39", name: "tepung", currentStock: 25000, minimumStock: 10000, unit: "g", orderUnit: "sak", orderUnitConversion: 25000, department: "rotiManis" },
    { id: "ing-40", name: "tusuk sate", currentStock: 500, minimumStock: 200, unit: "pcs", department: "rotiManis" },
    { id: "ing-41", name: "uht", currentStock: 0, minimumStock: 0, unit: "g", department: "rotiManis" },
    { id: "ing-42", name: "white chox", currentStock: 500, minimumStock: 1000, unit: "g", department: "rotiManis" },
    { id: "ing-43", name: "wijen hitam", currentStock: 0, minimumStock: 0, unit: "g", department: "rotiManis" },
    { id: "ing-44", name: "wijen putih", currentStock: 0, minimumStock: 0, unit: "g", department: "rotiManis" },

    // Donut Department
    { id: "ing-45", name: "Almond", currentStock: 0, minimumStock: 1000, unit: "g", department: "donut" },
    { id: "ing-46", name: "Bos", currentStock: 0, minimumStock: 1000, unit: "g", department: "donut" },
    { id: "ing-47", name: "Butter", currentStock: 0, minimumStock: 1000, unit: "g", department: "donut" },
    { id: "ing-48", name: "Ceres", currentStock: 0, minimumStock: 1000, unit: "g", department: "donut" },
    { id: "ing-49", name: "Compound Dark", currentStock: 0, minimumStock: 1000, unit: "g", department: "donut" },
    { id: "ing-50", name: "Compound White", currentStock: 0, minimumStock: 1000, unit: "g", department: "donut" },
    { id: "ing-51", name: "Crumble Oreo Coarsa", currentStock: 0, minimumStock: 1000, unit: "g", department: "donut" },
    { id: "ing-52", name: "Dusting Sugar", currentStock: 0, minimumStock: 1000, unit: "g", department: "donut" },
    { id: "ing-53", name: "Es Batu", currentStock: 0, minimumStock: 1000, unit: "g", department: "donut" },
    { id: "ing-54", name: "Garam", currentStock: 0, minimumStock: 1000, unit: "g", department: "donut" },
    { id: "ing-55", name: "Glaze Cappucino", currentStock: 0, minimumStock: 1000, unit: "g", department: "donut" },
    { id: "ing-56", name: "Glaze Dark", currentStock: 0, minimumStock: 1000, unit: "g", department: "donut" },
    { id: "ing-57", name: "Glaze Greentea", currentStock: 0, minimumStock: 1000, unit: "g", department: "donut" },
    { id: "ing-58", name: "Glaze Tiramisu", currentStock: 0, minimumStock: 1000, unit: "g", department: "donut" },
    { id: "ing-59", name: "Gula Pasir", currentStock: 0, minimumStock: 5000, unit: "g", department: "donut" },
    { id: "ing-60", name: "Kacang Morin", currentStock: 0, minimumStock: 1000, unit: "g", department: "donut" },
    { id: "ing-61", name: "Keju", currentStock: 0, minimumStock: 1000, unit: "g", department: "donut" },
    { id: "ing-62", name: "Margarin", currentStock: 0, minimumStock: 4000, unit: "g", department: "donut" },
    { id: "ing-63", name: "Premix", currentStock: 0, minimumStock: 5000, unit: "g", department: "donut" },
    { id: "ing-64", name: "Ragi", currentStock: 0, minimumStock: 500, unit: "g", department: "donut" },
    { id: "ing-65", name: "Softer", currentStock: 0, minimumStock: 500, unit: "g", department: "donut" },
    { id: "ing-66", name: "Susu Bubuk", currentStock: 0, minimumStock: 2000, unit: "g", department: "donut" },
    { id: "ing-67", name: "Telur", currentStock: 0, minimumStock: 1000, unit: "g", department: "donut" },
    { id: "ing-68", name: "Tepung Gerbang", currentStock: 0, minimumStock: 10000, unit: "g", orderUnit: "sak", orderUnitConversion: 25000, department: "donut" },

    // Roti Sobek Department (Placeholder)
    { id: "ing-69", name: "Tepung Roti Sobek", currentStock: 10000, minimumStock: 5000, unit: "g", orderUnit: "sak", orderUnitConversion: 25000, department: "rotiSobek" },
    { id: "ing-70", name: "Gula Roti Sobek", currentStock: 5000, minimumStock: 2000, unit: "g", department: "rotiSobek" },
    { id: "ing-71", name: "Susu Bubuk Sobek", currentStock: 2000, minimumStock: 1000, unit: "g", department: "rotiSobek" },
    { id: "ing-72", name: "Ragi Sobek", currentStock: 500, minimumStock: 250, unit: "g", department: "rotiSobek" },
    { id: "ing-73", name: "Margarin Sobek", currentStock: 4000, minimumStock: 2000, unit: "g", department: "rotiSobek" },
    { id: "ing-74", name: "Telur Sobek", currentStock: 1000, minimumStock: 500, unit: "g", department: "rotiSobek" },
    { id: "ing-75", name: "Filling Coklat Sobek", currentStock: 1000, minimumStock: 500, unit: "g", department: "rotiSobek" },
    { id: "ing-76", name: "Filling Keju Sobek", currentStock: 1000, minimumStock: 500, unit: "g", department: "rotiSobek" },
    { id: "ing-77", name: "Filling Durian", currentStock: 1000, minimumStock: 500, unit: "g", department: "rotiSobek" },
    { id: "ing-78", name: "Filling Srikaya", currentStock: 1000, minimumStock: 500, unit: "g", department: "rotiSobek" },
    { id: "ing-79", name: "Filling Vanilla", currentStock: 1000, minimumStock: 500, unit: "g", department: "rotiSobek" },
    { id: "ing-80", name: "Filling Choco Mocha", currentStock: 1000, minimumStock: 500, unit: "g", department: "rotiSobek" },
    { id: "ing-81", name: "Filling Cream Cheese Sobek", currentStock: 1000, minimumStock: 500, unit: "g", department: "rotiSobek" },
    { id: "ing-82", name: "Pewarna Pandan", currentStock: 100, minimumStock: 50, unit: "ml", department: "rotiSobek" }
];
