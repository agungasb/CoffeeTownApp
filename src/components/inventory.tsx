"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type ProductIngredients } from "@/lib/productIngredients";
import { ScrollArea } from "./ui/scroll-area";
import { useMemo } from "react";

interface InventoryProps {
    products: ProductIngredients;
}

const capitalize = (s: string) => s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

export default function Inventory({ products }: InventoryProps) {

    const sortedIngredients = useMemo(() => {
        const allIngredients = new Set<string>();
        Object.values(products).forEach(product => {
            Object.keys(product).forEach(ingredient => {
                allIngredients.add(ingredient);
            });
        });
        return Array.from(allIngredients).sort((a, b) => a.localeCompare(b));
    }, [products]);


    return (
        <Card className="glassmorphic border-2 border-border/30 w-full max-w-6xl mx-auto">
            <CardHeader>
                <CardTitle>Inventory</CardTitle>
                <CardDescription>Master list of all ingredients used across products.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[70vh]">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ingredient Name</TableHead>
                                <TableHead className="text-right">Current Stock</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedIngredients.map(ingredient => (
                                <TableRow key={ingredient}>
                                    <TableCell className="font-medium">{capitalize(ingredient)}</TableCell>
                                    <TableCell className="text-right text-muted-foreground italic">
                                        Not tracked
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
