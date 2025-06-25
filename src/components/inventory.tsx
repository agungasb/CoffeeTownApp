
"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ProductIngredients } from "@/lib/productIngredients";
import { capitalize } from "@/lib/utils";
import { Warehouse } from "lucide-react";

interface InventoryProps {
    products: ProductIngredients;
}

export default function Inventory({ products }: InventoryProps) {
    const sortedIngredients = useMemo(() => {
        const allIngredients = new Set<string>();
        Object.values(products).forEach(product => {
            Object.keys(product).forEach(ingredient => {
                allIngredients.add(ingredient.toLowerCase());
            });
        });
        return Array.from(allIngredients).sort((a, b) => a.localeCompare(b));
    }, [products]);

    return (
        <Card className="glassmorphic border-2 border-border/30 w-full max-w-6xl mx-auto">
            <CardHeader>
                <CardTitle>Inventory Master List</CardTitle>
            </CardHeader>
            <CardContent>
                 <div className="flex items-center gap-2 mb-4 text-foreground">
                    <Warehouse className="h-6 w-6 text-muted-foreground" />
                    <h3 className="text-xl font-semibold">Unique Ingredients ({sortedIngredients.length})</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {sortedIngredients.map(ingredient => (
                        <div key={ingredient} className="flex items-center justify-center p-3 bg-muted/50 rounded-md text-center h-20 transition-all hover:bg-muted hover:scale-105">
                            <span className="font-medium text-card-foreground">{capitalize(ingredient)}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
