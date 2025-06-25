"use client";

import { useState } from 'react';
import { type Recipe } from '@/lib/recipes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { PlusCircle, Edit, Trash2, ShieldAlert } from 'lucide-react';
import { RecipeForm } from './recipe-form';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from './ui/scroll-area';

interface RecipeManagerProps {
    recipes: Recipe[];
    setRecipes: (recipes: Recipe[]) => void;
    isLoggedIn: boolean;
}

export default function RecipeManager({ recipes, setRecipes, isLoggedIn }: RecipeManagerProps) {
    const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
    const [recipeToEdit, setRecipeToEdit] = useState<Recipe | null>(null);
    const [recipeToConfirm, setRecipeToConfirm] = useState<Recipe | null>(null);
    const [isConfirmingSave, setIsConfirmingSave] = useState(false);
    const { toast } = useToast();

    const handleAddClick = () => {
        setRecipeToEdit(null);
        setIsFormDialogOpen(true);
    };

    const handleEditClick = (recipe: Recipe) => {
        setRecipeToEdit(recipe);
        setIsFormDialogOpen(true);
    };

    const handleDelete = (recipeId: string) => {
        setRecipes(recipes.filter(r => r.id !== recipeId));
        toast({ title: 'Success', description: 'Recipe deleted successfully.' });
    };

    const handleFormSubmit = (data: Recipe) => {
        setIsFormDialogOpen(false);
        setRecipeToConfirm(data);
        setIsConfirmingSave(true);
    };

    const executeSave = () => {
        if (!recipeToConfirm) return;

        if (recipeToEdit && recipeToConfirm.id) {
            setRecipes(recipes.map(r => (r.id === recipeToConfirm.id ? recipeToConfirm : r)));
            toast({ title: 'Success', description: 'Recipe updated successfully.' });
        } else {
            setRecipes([...recipes, { ...recipeToConfirm, id: recipeToConfirm.name.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now() }]);
            toast({ title: 'Success', description: 'Recipe added successfully.' });
        }
        
        setRecipeToEdit(null);
        setRecipeToConfirm(null);
        setIsConfirmingSave(false);
    };


    return (
        <Card className="glassmorphic border-2 border-border/30 w-full max-w-6xl mx-auto">
            <CardHeader className="flex-col items-start sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <CardTitle>Recipe Management</CardTitle>
                    <CardDescription>Add, edit, or delete your custom recipes.</CardDescription>
                </div>
                 <Button onClick={handleAddClick} disabled={!isLoggedIn}>
                    <PlusCircle className="mr-2" /> Add New Recipe
                </Button>
            </CardHeader>
            <CardContent>
                {!isLoggedIn && (
                     <Alert variant="destructive" className="mb-4 bg-destructive/20 border-destructive/50">
                        <ShieldAlert className="h-4 w-4" />
                        <AlertTitle>Login Required</AlertTitle>
                        <AlertDescription>
                            Please log in to add, edit, or delete recipes.
                        </AlertDescription>
                    </Alert>
                )}
                <ScrollArea className="h-[70vh]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
                        {recipes.map((recipe) => (
                            <Card key={recipe.id} className="flex flex-col">
                                <CardHeader>
                                    <CardTitle className="text-lg">{recipe.name}</CardTitle>
                                    <CardDescription>{recipe.ingredients.length} ingredients</CardDescription>
                                </CardHeader>
                                <CardFooter className="mt-auto flex justify-end gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(recipe)} disabled={!isLoggedIn}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild disabled={!isLoggedIn}>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" disabled={!isLoggedIn}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete the recipe "{recipe.name}".
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
                        ))}
                    </div>
                </ScrollArea>
                

                {/* Form Dialog */}
                <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
                    <DialogContent className="md:max-w-[600px] max-h-[90vh] flex flex-col">
                        <DialogHeader>
                            <DialogTitle>{recipeToEdit ? 'Edit Recipe' : 'Add New Recipe'}</DialogTitle>
                        </DialogHeader>
                        <div className="flex-grow overflow-hidden">
                           <RecipeForm
                                recipeToEdit={recipeToEdit}
                                onSubmit={handleFormSubmit}
                                onCancel={() => setIsFormDialogOpen(false)}
                            />
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Save/Edit Confirmation Dialog */}
                <AlertDialog open={isConfirmingSave} onOpenChange={setIsConfirmingSave}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Save</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to save the changes for "{recipeToConfirm?.name}"?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setIsConfirmingSave(false)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={executeSave}>
                                Save Changes
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
    );
}
