
"use client";

import { useState } from 'react';
import { type Recipe } from '@/lib/recipes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { PlusCircle, Edit, Trash2, ShieldAlert, BookHeart, Weight } from 'lucide-react';
import { RecipeForm } from './recipe-form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { capitalize } from '@/lib/utils';

interface RecipeManagerProps {
    recipes: Recipe[];
    addRecipe: (recipe: Omit<Recipe, 'id'>) => Promise<void>;
    updateRecipe: (recipe: Recipe) => Promise<void>;
    deleteRecipe: (recipeId: string) => Promise<void>;
    isLoggedIn: boolean;
}

export default function RecipeManager({ recipes, addRecipe, updateRecipe, deleteRecipe, isLoggedIn }: RecipeManagerProps) {
    const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
    const [recipeToEdit, setRecipeToEdit] = useState<Recipe | null>(null);

    const calculateBaseWeight = (recipe: Recipe) => {
        return recipe.ingredients.reduce((total, ingredient) => total + ingredient.amount, 0);
    };

    const handleAddClick = () => {
        setRecipeToEdit(null);
        setIsFormDialogOpen(true);
    };

    const handleEditClick = (recipe: Recipe) => {
        setRecipeToEdit(recipe);
        setIsFormDialogOpen(true);
    };

    const handleDelete = async (recipeId: string) => {
        await deleteRecipe(recipeId);
    };

    const handleFormSubmit = async (data: Recipe) => {
        setIsFormDialogOpen(false);
        if (recipeToEdit && data.id) {
            await updateRecipe(data);
        } else {
            await addRecipe(data);
        }
        setRecipeToEdit(null);
    };

    return (
        <Card className="w-full max-w-6xl mx-auto glassmorphic">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
                <CardTitle>Recipe Management</CardTitle>
                 <Button onClick={handleAddClick} disabled={!isLoggedIn} variant="success">
                    <PlusCircle className="mr-2" /> Add New Recipe
                </Button>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2 mb-4 text-foreground">
                    <BookHeart className="h-6 w-6 text-muted-foreground" />
                    <h3 className="text-xl font-semibold">Existing Recipes ({recipes.length})</h3>
                </div>
                {!isLoggedIn && (
                     <Alert variant="destructive" className="mb-4 bg-destructive/20 border-destructive/50">
                        <ShieldAlert className="h-4 w-4" />
                        <AlertTitle>Login Required</AlertTitle>
                        <AlertDescription>Please log in to add, edit, or delete recipes.</AlertDescription>
                    </Alert>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recipes.map((recipe) => {
                        const baseWeight = calculateBaseWeight(recipe);
                        return (
                        <Card key={recipe.id} className="flex flex-col bg-background/70">
                            <CardHeader>
                                <CardTitle className="text-lg">{capitalize(recipe.name)}</CardTitle>
                                <CardDescription className="flex flex-wrap items-center gap-x-2">
                                    <span>{recipe.ingredients.length} ingredients</span>
                                    <span>|</span>
                                    <span>{recipe.steps.length} steps</span>
                                </CardDescription>
                                <div className="flex items-center text-sm text-muted-foreground pt-1">
                                    <Weight className="h-4 w-4 mr-1"/>
                                    Base Weight: <strong>{baseWeight.toLocaleString(undefined, {maximumFractionDigits: 0})}g</strong>
                                </div>
                            </CardHeader>
                             <CardContent className="flex-grow pb-0">
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value={recipe.id} className="border-b-0">
                                        <AccordionTrigger className="py-2 hover:no-underline">View Details</AccordionTrigger>
                                        <AccordionContent>
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="font-semibold mb-2">Ingredients</h4>
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                            <TableHead className="p-2 h-auto">Name</TableHead>
                                                            <TableHead className="p-2 h-auto text-right">Amount</TableHead>
                                                            <TableHead className="p-2 h-auto">Unit</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {recipe.ingredients.map((ing) => (
                                                            <TableRow key={ing.name}>
                                                                <TableCell className="p-2">{capitalize(ing.name)}</TableCell>
                                                                <TableCell className="p-2 text-right">{ing.amount}</TableCell>
                                                                <TableCell className="p-2">{ing.unit}</TableCell>
                                                            </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold mb-2">Steps</h4>
                                                    <ol className="list-decimal list-inside space-y-2 text-sm">
                                                        {recipe.steps.map((step, index) => (
                                                            <li key={index}>{step}</li>
                                                        ))}
                                                    </ol>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </CardContent>
                            <CardFooter className="mt-auto flex justify-end gap-2 pt-4">
                                <Button variant="info" size="sm" onClick={() => handleEditClick(recipe)} disabled={!isLoggedIn}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild disabled={!isLoggedIn}>
                                         <Button variant="destructive" size="sm" disabled={!isLoggedIn}>
                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="glassmorphic">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete the recipe "{capitalize(recipe.name)}".
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(recipe.id)} className="bg-destructive hover:bg-destructive/90">
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </CardFooter>
                        </Card>
                    )})}
                </div>
                
                <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
                    <DialogContent className="md:max-w-[700px] max-h-[90vh] flex flex-col p-0 glassmorphic">
                        <DialogHeader className="p-6 pb-0">
                            <DialogTitle>{recipeToEdit ? "Edit Recipe" : "Add New Recipe"}</DialogTitle>
                        </DialogHeader>
                        <div className="flex-grow overflow-y-auto px-6">
                           <RecipeForm
                                recipeToEdit={recipeToEdit}
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
