
"use client";

import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type AllProductsData, type ProductData, type IngredientData, type BaseRecipeData } from "@/lib/productIngredients";
import { Edit, PlusCircle, ShieldAlert, Trash2, Archive, CookingPot } from "lucide-react";
import { ProductForm } from './product-form';
import { capitalize } from '@/lib/utils';
import type { Recipe } from '@/lib/recipes';

interface ProductManagerProps {
    products: AllProductsData;
    recipes: Recipe[];
    updateProducts: (products: AllProductsData) => Promise<void>;
    isLoggedIn: boolean;
}

type ProductFormData = { 
    name: string; 
    baseRecipe?: {
        recipeName?: string;
        weight?: number | '';
    };
    ingredients: { name: string; amount: number; unit: string }[];
    calculation?: { divisor?: number | '', unit?: string, multiplier?: number | '' } 
};

export default function ProductManager({ products, recipes, updateProducts, isLoggedIn }: ProductManagerProps) {
    const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<{ 
        name: string; 
        baseRecipe?: BaseRecipeData;
        ingredients: { name: string; amount: number; unit: string }[];
        calculation?: { divisor?: number; unit?: string; multiplier?: number; }
    } | null>(null);
    const productCount = Object.keys(products).length;

    const handleAddClick = () => {
        setProductToEdit(null);
        setIsFormDialogOpen(true);
    };

    const handleEditClick = (productName: string, productData: ProductData) => {
        setProductToEdit({
            name: productName,
            baseRecipe: productData.baseRecipe,
            ingredients: productData.ingredients ? Object.entries(productData.ingredients).map(([name, data]) => ({ name, amount: data.amount, unit: data.unit })) : [],
            calculation: productData.calculation
        });
        setIsFormDialogOpen(true);
    };

    const handleDelete = async (productName: string) => {
        const newProducts = { ...products };
        delete newProducts[productName];
        await updateProducts(newProducts);
    };

    const handleFormSubmit = async (data: ProductFormData) => {
        const newProducts = { ...products };
        
        const newIngredients: Record<string, IngredientData> = {};
        if (data.ingredients) {
            data.ingredients.forEach(ing => {
                if(ing.name && ing.amount && ing.unit) { // ensure ingredient is not empty
                    newIngredients[ing.name.toLowerCase()] = { amount: ing.amount, unit: ing.unit };
                }
            });
        }

        const newProductData: ProductData = {
            ingredients: newIngredients
        };

        if (data.baseRecipe?.recipeName && data.baseRecipe.weight) {
            newProductData.baseRecipe = {
                recipeName: data.baseRecipe.recipeName,
                weight: Number(data.baseRecipe.weight)
            }
        }
        
        if (data.calculation && (data.calculation.divisor || data.calculation.unit || data.calculation.multiplier)) {
            newProductData.calculation = {
                divisor: data.calculation.divisor ? Number(data.calculation.divisor) : undefined,
                unit: data.calculation.unit || undefined,
                multiplier: data.calculation.multiplier ? Number(data.calculation.multiplier) : undefined
            };
            if (!newProductData.calculation.divisor) delete newProductData.calculation.divisor;
            if (!newProductData.calculation.unit) delete newProductData.calculation.unit;
            if (!newProductData.calculation.multiplier) delete newProductData.calculation.multiplier;
            if (Object.keys(newProductData.calculation).length === 0) {
                delete newProductData.calculation;
            }
        }

        if (productToEdit && productToEdit.name.toLowerCase() !== data.name.toLowerCase()) {
            delete newProducts[productToEdit.name];
        }
        
        newProducts[data.name] = newProductData;
        
        await updateProducts(newProducts);

        setIsFormDialogOpen(false);
        setProductToEdit(null);
    };

    return (
        <Card className="w-full max-w-6xl mx-auto glassmorphic">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
                <CardTitle>Product Management</CardTitle>
                <Button onClick={handleAddClick} disabled={!isLoggedIn} variant="success">
                    <PlusCircle className="mr-2" /> Add New Product
                </Button>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2 mb-4 text-foreground">
                    <Archive className="h-6 w-6 text-muted-foreground" />
                    <h3 className="text-xl font-semibold">Managed Products ({productCount})</h3>
                </div>
                {!isLoggedIn && (
                    <Alert variant="destructive" className="mb-4 bg-destructive/20 border-destructive/50">
                        <ShieldAlert className="h-4 w-4" />
                        <AlertTitle>Login Required</AlertTitle>
                        <AlertDescription>Please log in to add, edit, or delete products.</AlertDescription>
                    </Alert>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(products).sort(([a], [b]) => a.localeCompare(b)).map(([productName, productData]) => (
                        <Card key={productName} className="flex flex-col bg-background/70">
                            <CardHeader>
                                <CardTitle className="text-lg">{capitalize(productName)}</CardTitle>
                                <CardDescription>{productData.ingredients ? Object.keys(productData.ingredients).length : 0} additional ingredients</CardDescription>
                                {productData.baseRecipe && (
                                    <div className="flex items-center text-sm text-muted-foreground pt-1">
                                        <CookingPot className="h-4 w-4 mr-1"/>
                                        Base: <strong>{capitalize(productData.baseRecipe.recipeName)} ({productData.baseRecipe.weight}g)</strong>
                                    </div>
                                )}
                            </CardHeader>
                            <CardContent className="flex-grow pb-0">
                                 <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value={productName} className="border-b-0">
                                        <AccordionTrigger className="py-2 hover:no-underline">View Details</AccordionTrigger>
                                        <AccordionContent>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                    <TableHead className="p-2 h-auto">Ingredient</TableHead>
                                                    <TableHead className="p-2 h-auto text-right">Amount</TableHead>
                                                    <TableHead className="p-2 h-auto">Unit</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {productData.ingredients && Object.keys(productData.ingredients).length > 0 ? Object.entries(productData.ingredients).map(([ingredientName, ingredientData]) => (
                                                    <TableRow key={ingredientName}>
                                                        <TableCell className="p-2">{capitalize(ingredientName)}</TableCell>
                                                        <TableCell className="p-2 text-right">{typeof ingredientData.amount === 'number' ? ingredientData.amount.toFixed(3) : ingredientData.amount}</TableCell>
                                                        <TableCell className="p-2 text-muted-foreground">{ingredientData.unit}</TableCell>
                                                    </TableRow>
                                                    )) : (
                                                        <TableRow><TableCell colSpan={3} className="text-center p-2 text-muted-foreground">No additional ingredients</TableCell></TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </CardContent>
                            <CardFooter className="mt-auto flex justify-end gap-2 pt-4">
                                <Button variant="info" size="sm" disabled={!isLoggedIn} onClick={() => handleEditClick(productName, productData)}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm" disabled={!isLoggedIn}>
                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="glassmorphic">
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

                <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
                    <DialogContent className="md:max-w-[600px] max-h-[90vh] flex flex-col p-0 glassmorphic">
                        <DialogHeader className="p-6 pb-0">
                            <DialogTitle>{productToEdit ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                        </DialogHeader>
                        <div className="flex-grow overflow-y-auto px-6">
                            <ProductForm
                                productToEdit={productToEdit}
                                recipes={recipes}
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
