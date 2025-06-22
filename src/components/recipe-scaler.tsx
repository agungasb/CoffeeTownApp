"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { type Recipe } from "@/lib/recipes";
import { ScrollArea } from './ui/scroll-area';

interface ScaledIngredient {
    name: string;
    amount: string;
    unit: string;
}

interface RecipeScalerProps {
    recipes: Recipe[];
}

export default function RecipeScaler({ recipes }: RecipeScalerProps) {
    const [selectedRecipeId, setSelectedRecipeId] = useState<string>('');
    const [multiplier, setMultiplier] = useState<number>(1);
    const [scaledIngredients, setScaledIngredients] = useState<ScaledIngredient[]>([]);
    const [recipeTitle, setRecipeTitle] = useState('');

    const handleScaleRecipe = () => {
        if (!selectedRecipeId || multiplier <= 0) {
            return;
        }

        const recipe = recipes.find(r => r.id === selectedRecipeId);
        if (!recipe) return;
        
        const scaled = recipe.ingredients.map((ing) => ({
            name: ing.name,
            amount: (ing.amount * multiplier).toFixed(2),
            unit: ing.unit,
        }));
        
        setScaledIngredients(scaled);
        setRecipeTitle(recipe.name);
    };

    return (
        <Card className="glassmorphic border-2 border-border/30 w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="font-headline text-2xl md:text-3xl">Recipe Scaler</CardTitle>
                <CardDescription>Choose a recipe and enter a multiplier to scale the ingredients.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-3 gap-6 items-start">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="recipes">Choose a recipe</Label>
                            <Select onValueChange={setSelectedRecipeId} value={selectedRecipeId}>
                                <SelectTrigger id="recipes">
                                    <SelectValue placeholder="Select a recipe" />
                                </SelectTrigger>
                                <SelectContent>
                                    {recipes.map(recipe => (
                                        <SelectItem key={recipe.id} value={recipe.id}>
                                            {recipe.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="multiplier">Enter multiplier</Label>
                             <Input 
                                id="multiplier"
                                type="number" 
                                value={multiplier}
                                onChange={(e) => setMultiplier(parseFloat(e.target.value) || 1)}
                                min="0.1"
                                step="0.1"
                             />
                        </div>
                        <Button onClick={handleScaleRecipe} className="w-full">Scale Recipe</Button>
                    </div>

                    <div className="md:col-span-2">
                        {scaledIngredients.length > 0 ? (
                           <div className='pl-4'>
                                <h3 className="font-headline text-xl md:text-2xl mb-4">Scaled: {recipeTitle}</h3>
                                <ScrollArea className="h-[40vh] md:h-[50vh] pr-4">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Ingredient</TableHead>
                                            <TableHead className="text-right">Amount</TableHead>
                                            <TableHead>Unit</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {scaledIngredients.map((ing) => (
                                            <TableRow key={ing.name}>
                                                <TableCell className="font-medium">{ing.name}</TableCell>
                                                <TableCell className="text-right">{ing.amount}</TableCell>
                                                <TableCell>{ing.unit}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                </ScrollArea>
                           </div>
                        ) : (
                            <div className="flex items-center justify-center h-full min-h-[40vh] text-muted-foreground italic border-2 border-dashed rounded-lg">
                                Select a recipe and click 'Scale' to see results.
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
