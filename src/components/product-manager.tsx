
"use client";

import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type ProductIngredients } from "@/lib/productIngredients";
import { Edit, PlusCircle, ShieldAlert, Trash2 } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { useToast } from '@/hooks/use-toast';
import { ProductForm } from './product-form';
import { capitalize } from '@/lib/utils';

interface ProductManagerProps {
    products: ProductIngredients;
    setProducts: (products: ProductIngredients) => void;
    isLoggedIn: boolean;
}

export default function ProductManager({ products, setProducts, isLoggedIn }: ProductManagerProps) {
    const { toast } = useToast();
    const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<{ name: string; ingredients: { name: string; amount: number; }[] } | null>(null);

    const handleAddClick = () => {
        setProductToEdit(null);
        setIsFormDialogOpen(true);
    };

    const handleEditClick = (productName: string, ingredients: Record<string, number>) => {
        setProductToEdit({
            name: productName,
            ingredients: Object.entries(ingredients).map(([name, amount]) => ({ name, amount }))
        });
        setIsFormDialogOpen(true);
    };

    const handleDelete = (productName: string) => {
        const newProducts = { ...products };
        delete newProducts[productName];
        setProducts(newProducts);
        toast({ title: 'Success', description: `Product "${capitalize(productName)}" deleted.` });
    };

    const handleFormSubmit = (data: { name: string; ingredients: { name: string; amount: number }[] }) => {
        const newProducts = { ...products };
        const newIngredients: Record<string, number> = {};
        data.ingredients.forEach(ing => {
            newIngredients[ing.name] = ing.amount;
        });

        // If editing an old product with a new name, delete the old one
        if (productToEdit && productToEdit.name !== data.name) {
            delete newProducts[productToEdit.name];
        }
        
        newProducts[data.name] = newIngredients;
        setProducts(newProducts);

        toast({ title: 'Success', description: `Product "${capitalize(data.name)}" saved.` });
        setIsFormDialogOpen(false);
        setProductToEdit(null);
    };

    return (
        <Card className="glassmorphic border-2 border-border/30 w-full max-w-6xl mx-auto">
            <CardHeader className="flex-col items-start sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <CardTitle>Product Management</CardTitle>
                    <CardDescription>View and manage ingredients for each product.</CardDescription>
                </div>
                <Button onClick={handleAddClick} disabled={!isLoggedIn}>
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
                        {Object.entries(products).sort(([a], [b]) => a.localeCompare(b)).map(([productName, ingredients]) => (
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
                                                            <TableHead className="p-2 h-auto text-right">Amount</TableHead>
                                                            <TableHead className="p-2 h-auto">Unit</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {Object.entries(ingredients).map(([ingredientName, amount]) => (
                                                            <TableRow key={ingredientName}>
                                                                <TableCell className="p-2">{capitalize(ingredientName)}</TableCell>
                                                                <TableCell className="p-2 text-right">{typeof amount === 'number' ? amount.toFixed(3) : amount}</TableCell>
                                                                <TableCell className="p-2 text-muted-foreground">{ingredientName.toLowerCase() === 'tusuk sate' ? 'pcs' : 'g'}</TableCell>
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
                                    <Button variant="outline" size="sm" disabled={!isLoggedIn} onClick={() => handleEditClick(productName, ingredients)}>
                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" size="sm" disabled={!isLoggedIn}>
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete the product "{capitalize(productName)}".
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(productName)} className="bg-destructive hover:bg-destructive/90">
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>

                <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
                    <DialogContent className="md:max-w-[600px] max-h-[90vh] flex flex-col p-0">
                        <DialogHeader className="p-6 pb-0">
                            <DialogTitle>{productToEdit ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                        </DialogHeader>
                        <div className="flex-grow overflow-hidden px-6">
                            <ProductForm
                                productToEdit={productToEdit}
                                onSubmit={handleFormSubmit}
                                onCancel={() => setIsFormDialogOpen(false)}
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
