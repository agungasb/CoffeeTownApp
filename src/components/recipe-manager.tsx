"use client";

import { useState } from 'react';
import { type Recipe } from '@/lib/recipes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { RecipeForm } from './recipe-form';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from './ui/scroll-area';

interface RecipeManagerProps {
    recipes: Recipe[];
    setRecipes: (recipes: Recipe[]) => void;
}

export default function RecipeManager({ recipes, setRecipes }: RecipeManagerProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [recipeToEdit, setRecipeToEdit] = useState<Recipe | null>(null);
    const { toast } = useToast();

    const handleAddClick = () => {
        setRecipeToEdit(null);
        setIsDialogOpen(true);
    };

    const handleEditClick = (recipe: Recipe) => {
        setRecipeToEdit(recipe);
        setIsDialogOpen(true);
    };

    const handleDelete = (recipeId: string) => {
        setRecipes(recipes.filter(r => r.id !== recipeId));
        toast({ title: 'Success', description: 'Recipe deleted successfully.' });
    };

    const handleFormSubmit = (data: Recipe) => {
        if (recipeToEdit) {
            setRecipes(recipes.map(r => (r.id === data.id ? data : r)));
            toast({ title: 'Success', description: 'Recipe updated successfully.' });
        } else {
            setRecipes([...recipes, { ...data, id: data.name.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now() }]);
            toast({ title: 'Success', description: 'Recipe added successfully.' });
        }
        setRecipeToEdit(null);
        setIsDialogOpen(false);
    };

    return (
        <Card className="glassmorphic border-2 border-border/30 w-full max-w-6xl mx-auto">
            <CardHeader className="flex-row items-center justify-between">
                <div>
                    <CardTitle className="font-headline text-3xl">Recipe Management</CardTitle>
                    <CardDescription>Add, edit, or delete your custom recipes.</CardDescription>
                </div>
                 <Button onClick={handleAddClick}>
                    <PlusCircle className="mr-2" /> Add New Recipe
                </Button>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[60vh] rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[40%]">Recipe Name</TableHead>
                                <TableHead>Ingredients</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recipes.map((recipe) => (
                                <TableRow key={recipe.id}>
                                    <TableCell className="font-medium">{recipe.name}</TableCell>
                                    <TableCell className="text-muted-foreground text-xs truncate max-w-sm">
                                        {recipe.ingredients.slice(0, 4).map(ing => ing.name).join(', ')}
                                        {recipe.ingredients.length > 4 ? ', ...' : ''}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(recipe)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
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
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
                        <DialogHeader>
                            <DialogTitle>{recipeToEdit ? 'Edit Recipe' : 'Add New Recipe'}</DialogTitle>
                        </DialogHeader>
                        <div className="flex-grow overflow-hidden">
                           <RecipeForm
                                recipeToEdit={recipeToEdit}
                                onSubmit={handleFormSubmit}
                                onCancel={() => setIsDialogOpen(false)}
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
