
export interface InventoryItem {
    id: string;
    name: string;
    currentStock: number;
    minimumStock: number;
    unit: string;
}

export const inventoryData: InventoryItem[] = [
    { id: "ing-1", name: "tepung", currentStock: 25000, minimumStock: 10000, unit: "g" },
    { id: "ing-2", name: "gula pasir", currentStock: 15000, minimumStock: 5000, unit: "g" },
    { id: "ing-3", name: "susu bubuk", currentStock: 4500, minimumStock: 2000, unit: "g" },
    { id: "ing-4", name: "ragi", currentStock: 800, minimumStock: 500, unit: "g" },
    { id: "ing-5", name: "garam", currentStock: 1200, minimumStock: 500, unit: "g" },
    { id: "ing-6", name: "margarin", currentStock: 8000, minimumStock: 4000, unit: "g" },
    { id: "ing-7", name: "telur utuh", currentStock: 150, minimumStock: 60, unit: "pcs" },
    { id: "ing-8", name: "abon", currentStock: 1800, minimumStock: 1000, unit: "g" },
    { id: "ing-9", name: "sosis", currentStock: 400, minimumStock: 200, unit: "pcs" },
    { id: "ing-10", name: "keju", currentStock: 2200, minimumStock: 1000, unit: "g" },
    { id: "ing-11", name: "coklat filling", currentStock: 900, minimumStock: 1500, unit: "g" },
    { id: "ing-12", name: "ceres", currentStock: 3000, minimumStock: 2000, unit: "g" },
    { id: "ing-13", name: "mayonaise", currentStock: 1400, minimumStock: 1000, unit: "g" },
    { id: "ing-14", name: "saos sambal", currentStock: 800, minimumStock: 1000, unit: "g" },
    { id: "ing-15", name: "daun bawang", currentStock: 150, minimumStock: 200, unit: "g" },
    { id: "ing-16", name: "white chox", currentStock: 500, minimumStock: 1000, unit: "g" },
    { id: "ing-17", name: "premix", currentStock: 0, minimumStock: 5000, unit: "g" },
    { id: "ing-18", name: "tusuk sate", currentStock: 500, minimumStock: 200, unit: "pcs" },
];
