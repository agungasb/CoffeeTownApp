"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { recipes } from "@/lib/recipes";
import { ScrollArea } from './ui/scroll-area';

interface ScaledIngredient {
    name: string;
    amount: string;
    unit: string;
}

const capitalize = (s: string) => s.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

export default function RecipeScaler() {
    const [selectedRecipe, setSelectedRecipe] = useState<string>('');
    const [multiplier, setMultiplier] = useState<number>(1);
    const [scaledIngredients, setScaledIngredients] = useState<ScaledIngredient[]>([]);
    const [recipeTitle, setRecipeTitle] = useState('');

    const handleScaleRecipe = () => {
        if (!selectedRecipe || multiplier <= 0) {
            // Potentially show a toast notification for error
            return;
        }

        const recipe = recipes[selectedRecipe];
        const scaled = Object.entries(recipe).map(([ingredient, details]) => ({
            name: capitalize(ingredient),
            amount: (details.amount * multiplier).toFixed(2),
            unit: details.unit,
        }));
        
        setScaledIngredients(scaled);
        setRecipeTitle(capitalize(selectedRecipe));
    };

    return (
        <Card className="glassmorphic border-2 border-border/30 w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Recipe Scaler</CardTitle>
                <CardDescription>Choose a recipe and enter a multiplier to scale the ingredients.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-3 gap-6 items-start">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="recipes" className="text-base">Choose a recipe</Label>
                            <Select onValueChange={setSelectedRecipe} value={selectedRecipe}>
                                <SelectTrigger id="recipes">
                                    <SelectValue placeholder="Select a recipe" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.keys(recipes).map(recipeKey => (
                                        <SelectItem key={recipeKey} value={recipeKey}>
                                            {capitalize(recipeKey)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="multiplier" className="text-base">Enter multiplier</Label>
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
                                <h3 className="font-headline text-2xl mb-4">Scaled: {recipeTitle}</h3>
                                <ScrollArea className="h-[50vh] pr-4">
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
