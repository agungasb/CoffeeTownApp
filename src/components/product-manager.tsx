
"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { productIngredientsData } from "@/lib/productIngredients";
import { Edit, PlusCircle, ShieldAlert, Trash2 } from "lucide-react";

interface ProductManagerProps {
    isLoggedIn: boolean;
}

const capitalize = (s: string) => s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

export default function ProductManager({ isLoggedIn }: ProductManagerProps) {
    // In a real app, this would likely come from state management or an API call
    const products = productIngredientsData;

    return (
        <Card className="glassmorphic border-2 border-border/30 w-full max-w-6xl mx-auto">
            <CardHeader className="flex-col items-start sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <CardTitle>Product Management</CardTitle>
                    <CardDescription>View and manage ingredients for each product.</CardDescription>
                </div>
                <Button disabled={!isLoggedIn}>
                    <PlusCircle className="mr-2" /> Add New Product
                </Button>
            </CardHeader>
            <CardContent>
                {!isLoggedIn && (
                    <Alert variant="destructive" className="mb-4 bg-destructive/20 border-destructive/50">
                        <ShieldAlert className="h-4 w-4" />
                        <AlertTitle>Login Required</AlertTitle>
                        <AlertDescription>
                            Please log in to add, edit, or delete products.
                        </AlertDescription>
                    </Alert>
                )}
                 <Accordion type="single" collapsible className="w-full">
                    {Object.entries(products).map(([productName, ingredients]) => (
                        <AccordionItem value={productName} key={productName}>
                        <AccordionTrigger>{capitalize(productName)}</AccordionTrigger>
                        <AccordionContent>
                            <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Ingredient</TableHead>
                                <TableHead className="text-right">Amount (grams)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Object.entries(ingredients).map(([ingredientName, amount]) => (
                                <TableRow key={ingredientName}>
                                    <TableCell>{ingredientName}</TableCell>
                                    <TableCell className="text-right">{typeof amount === 'number' ? amount.toFixed(3) : amount}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                            </Table>
                            <div className="flex justify-end gap-2 mt-4">
                                <Button variant="outline" size="sm" disabled={!isLoggedIn}><Edit className="mr-2 h-4 w-4" /> Edit</Button>
                                <Button variant="destructive" size="sm" disabled={!isLoggedIn}><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
                            </div>
                        </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    );
}
