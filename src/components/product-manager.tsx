
"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { productIngredientsData } from "@/lib/productIngredients";
import { Edit, PlusCircle, ShieldAlert, Trash2 } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

interface ProductManagerProps {
    isLoggedIn: boolean;
}

const capitalize = (s: string) => s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

export default function ProductManager({ isLoggedIn }: ProductManagerProps) {
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
                 <ScrollArea className="h-[70vh]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
                        {Object.entries(products).map(([productName, ingredients]) => (
                            <Card key={productName} className="flex flex-col">
                                <CardHeader>
                                    <CardTitle className="text-lg">{capitalize(productName)}</CardTitle>
                                    <CardDescription>{Object.keys(ingredients).length} ingredients</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow pb-0">
                                     <Accordion type="single" collapsible className="w-full">
                                        <AccordionItem value={productName} className="border-b-0">
                                            <AccordionTrigger className="py-2 hover:no-underline">View Details</AccordionTrigger>
                                            <AccordionContent>
                                                <ScrollArea className="h-48">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                            <TableHead className="p-2 h-auto">Ingredient</TableHead>
                                                            <TableHead className="p-2 h-auto text-right">Amount (g)</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {Object.entries(ingredients).map(([ingredientName, amount]) => (
                                                            <TableRow key={ingredientName}>
                                                                <TableCell className="p-2">{ingredientName}</TableCell>
                                                                <TableCell className="p-2 text-right">{typeof amount === 'number' ? amount.toFixed(3) : amount}</TableCell>
                                                            </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </ScrollArea>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </CardContent>
                                <CardFooter className="mt-auto flex justify-end gap-2 pt-4">
                                    <Button variant="outline" size="sm" disabled={!isLoggedIn}><Edit className="mr-2 h-4 w-4" /> Edit</Button>
                                    <Button variant="destructive" size="sm" disabled={!isLoggedIn}><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
