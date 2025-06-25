
"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ProductIngredients } from "@/lib/productIngredients";
import { capitalize } from "@/lib/utils";

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
                <CardDescription>A complete list of all unique ingredients used across all products.</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {sortedIngredients.map(ingredient => (
                        <li key={ingredient} className="flex items-center justify-center p-3 bg-muted/50 rounded-md text-center h-20 transition-all hover:bg-muted hover:scale-105">
                            <span className="font-medium text-card-foreground">{capitalize(ingredient)}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
