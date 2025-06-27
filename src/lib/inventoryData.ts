
export interface InventoryItem {
    id: string;
    name: string;
    currentStock: number;
    minimumStock: number;
    unit: string;
    orderUnit?: string;
    orderUnitConversion?: number;
}

export const inventoryData: InventoryItem[] = [
    { id: "ing-1", name: "abon", currentStock: 1800, minimumStock: 1000, unit: "g" },
    { id: "ing-2", name: "air", currentStock: 0, minimumStock: 0, unit: "g" },
    { id: "ing-3", name: "almond", currentStock: 0, minimumStock: 0, unit: "g" },
    { id: "ing-4", name: "bakom", currentStock: 0, minimumStock: 0, unit: "g" },
    { id: "ing-5", name: "bos", currentStock: 0, minimumStock: 0, unit: "g" },
    { id: "ing-6", name: "ceres", currentStock: 3000, minimumStock: 2000, unit: "g", orderUnit: "dus", orderUnitConversion: 12000 },
    { id: "ing-7", name: "coklat filling", currentStock: 900, minimumStock: 1500, unit: "g" },
    { id: "ing-8", name: "crumble oreo", currentStock: 0, minimumStock: 0, unit: "g" },
    { id: "ing-9", name: "crumble velvet", currentStock: 0, minimumStock: 0, unit: "g" },
    { id: "ing-10", name: "cuka", currentStock: 0, minimumStock: 0, unit: "g" },
    { id: "ing-11", name: "dark chox", currentStock: 0, minimumStock: 0, unit: "g" },
    { id: "ing-12", name: "daun bawang", currentStock: 150, minimumStock: 200, unit: "g" },
    { id: "ing-13", name: "es batu", currentStock: 0, minimumStock: 0, unit: "g" },
    { id: "ing-14", name: "everwhip", currentStock: 0, minimumStock: 0, unit: "g" },
    { id: "ing-15", name: "garam", currentStock: 1200, minimumStock: 500, unit: "g" },
    { id: "ing-16", name: "gula halus", currentStock: 0, minimumStock: 0, unit: "g" },
    { id: "ing-17", name: "gula pasir", currentStock: 15000, minimumStock: 5000, unit: "g", orderUnit: "sak", orderUnitConversion: 50000 },
    { id: "ing-18", name: "kacang merah", currentStock: 0, minimumStock: 0, unit: "g" },
    { id: "ing-19", name: "keju", currentStock: 2200, minimumStock: 1000, unit: "g", orderUnit: "dus", orderUnitConversion: 24000 },
    { id: "ing-20", name: "maizena", currentStock: 0, minimumStock: 0, unit: "g" },
    { id: "ing-21", name: "margarin", currentStock: 8000, minimumStock: 4000, unit: "g", orderUnit: "dus", orderUnitConversion: 15000 },
    { id: "ing-22", name: "mayonaise", currentStock: 1400, minimumStock: 1000, unit: "g" },
    { id: "ing-23", name: "minyak", currentStock: 0, minimumStock: 0, unit: "g" },
    { id: "ing-24", name: "optimo", currentStock: 0, minimumStock: 0, unit: "g" },
    { id: "ing-25", name: "pelembut", currentStock: 0, minimumStock: 0, unit: "g" },
    { id: "ing-26", name: "premix", currentStock: 0, minimumStock: 5000, unit: "g" },
    { id: "ing-27", name: "puratos", currentStock: 0, minimumStock: 0, unit: "g" },
    { id: "ing-28", name: "putih telur", currentStock: 0, minimumStock: 0, unit: "g" },
    { id: "ing-29", name: "ragi", currentStock: 800, minimumStock: 500, unit: "g", orderUnit: "dus", orderUnitConversion: 10000 },
    { id: "ing-30", name: "saos sambal", currentStock: 800, minimumStock: 1000, unit: "g" },
    { id: "ing-31", name: "saos tomat", currentStock: 0, minimumStock: 0, unit: "g" },
    { id: "ing-32", name: "selai straw", currentStock: 0, minimumStock: 0, unit: "g" },
    { id: "ing-33", name: "skm", currentStock: 0, minimumStock: 0, unit: "g" },
    { id: "ing-34", name: "sonton vanilla", currentStock: 0, minimumStock: 0, unit: "g" },
    { id: "ing-35", name: "sosis", currentStock: 400, minimumStock: 200, unit: "pcs", orderUnit: "pack", orderUnitConversion: 28 },
    { id: "ing-36", name: "susu bubuk", currentStock: 4500, minimumStock: 2000, unit: "g", orderUnit: "dus", orderUnitConversion: 25000 },
    { id: "ing-37", name: "telur kuning", currentStock: 0, minimumStock: 0, unit: "g" },
    { id: "ing-38", name: "telur utuh", currentStock: 150, minimumStock: 60, unit: "g" },
    { id: "ing-39", name: "tepung", currentStock: 25000, minimumStock: 10000, unit: "g", orderUnit: "sak", orderUnitConversion: 25000 },
    { id: "ing-40", name: "tusuk sate", currentStock: 500, minimumStock: 200, unit: "pcs" },
    { id: "ing-41", name: "uht", currentStock: 0, minimumStock: 0, unit: "g" },
    { id: "ing-42", name: "white chox", currentStock: 500, minimumStock: 1000, unit: "g" },
    { id: "ing-43", name: "wijen hitam", currentStock: 0, minimumStock: 0, unit: "g" },
    { id: "ing-44", name: "wijen putih", currentStock: 0, minimumStock: 0, unit: "g" }
];
