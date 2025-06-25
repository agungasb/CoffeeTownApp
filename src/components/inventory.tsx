"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ProductIngredients } from "@/lib/productIngredients";
import { ScrollArea } from "./ui/scroll-area";
import { useMemo } from "react";
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
        <Card className="glassmorphic border-2 border-border/30 w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Inventory</CardTitle>
                <CardDescription>Master list of all ingredients used across products.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[70vh] pr-4">
                    <div className="space-y-3">
                         <div className="flex justify-between items-center p-3 font-semibold text-white border-b border-white/30">
                            <span>Ingredient Name</span>
                            <span>Current Stock</span>
                        </div>
                        {sortedIngredients.map(ingredient => (
                            <div key={ingredient} className="flex justify-between items-center p-3 bg-black/20 rounded-md">
                                <span className="font-medium text-white">{capitalize(ingredient)}</span>
                                <span className="text-sm text-white/70">
                                    Not tracked
                                </span>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
