
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { type Recipe } from "@/lib/recipes";
import { BookOpen, Receipt, Notebook, X, Scale } from 'lucide-react';
import { capitalize } from '@/lib/utils';

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
    const [multiplier, setMultiplier] = useState<string>('');
    const [scaledIngredients, setScaledIngredients] = useState<ScaledIngredient[]>([]);
    const [recipeTitle, setRecipeTitle] = useState('');
    const [recipeSteps, setRecipeSteps] = useState<string[]>([]);

    const handleScaleRecipe = () => {
        const scaleValue = parseFloat(multiplier);
        if (!selectedRecipeId || !multiplier || isNaN(scaleValue) || scaleValue <= 0) {
            return;
        }

        const recipe = recipes.find(r => r.id === selectedRecipeId);
        if (!recipe) return;
        
        const scaled = recipe.ingredients.map((ing) => ({
            name: ing.name,
            amount: (ing.amount * scaleValue).toFixed(2),
            unit: ing.unit,
        }));
        
        setScaledIngredients(scaled);
        setRecipeTitle(recipe.name);
        setRecipeSteps(recipe.steps);
    };

    const handleSelectRecipe = (id: string) => {
        setSelectedRecipeId(id);
        setMultiplier('1');
        setScaledIngredients([]);
        setRecipeTitle('');
        setRecipeSteps([]);
    }

    return (
        <Card className="w-full max-w-4xl mx-auto glassmorphic">
            <CardHeader>
                <CardTitle>Recipe Scaler</CardTitle>
                <CardDescription>Choose a recipe and enter a multiplier to scale the ingredients.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-3 gap-6 items-start">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="recipes" className="flex items-center gap-2">
                                <Notebook className="h-4 w-4" />
                                Choose Recipe:
                            </Label>
                            <Select onValueChange={handleSelectRecipe} value={selectedRecipeId}>
                                <SelectTrigger id="recipes">
                                    <SelectValue placeholder="Select a recipe" />
                                </SelectTrigger>
                                <SelectContent>
                                    {recipes.map(recipe => (
                                        <SelectItem key={recipe.id} value={recipe.id}>
                                            {capitalize(recipe.name)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="multiplier" className="flex items-center gap-2">
                                <X className="h-4 w-4" />
                                Scale Factor:
                             </Label>
                             <Input 
                                id="multiplier"
                                type="number" 
                                value={multiplier}
                                onChange={(e) => setMultiplier(e.target.value)}
                                min="0.1"
                                step="0.1"
                                placeholder="e.g. 1.5"
                             />
                        </div>
                        <Button onClick={handleScaleRecipe} className="w-full">
                            <Scale className="h-4 w-4" />
                            Scale Recipe
                        </Button>
                    </div>

                    <div className="md:col-span-2">
                        {scaledIngredients.length > 0 ? (
                           <div className='space-y-8'>
                               <div>
                                    <h3 className="font-semibold text-xl md:text-2xl mb-4 flex items-center gap-2">
                                        <Receipt /> {capitalize(recipeTitle)} (x{multiplier})
                                    </h3>
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
                                                    <TableCell className="font-medium">{capitalize(ing.name)}</TableCell>
                                                    <TableCell className="text-right">{ing.amount}</TableCell>
                                                    <TableCell>{ing.unit}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                               </div>
                               <div>
                                    <h3 className="font-semibold text-xl md:text-2xl mb-4 flex items-center gap-2">
                                        <BookOpen /> Instructions
                                    </h3>
                                    <ol className="list-decimal list-inside space-y-2 text-sm text-foreground/90 bg-muted/30 p-4 rounded-md">
                                        {recipeSteps.map((step, index) => (
                                            <li key={index} className="pl-2">{step}</li>
                                        ))}
                                    </ol>
                               </div>
                           </div>
                        ) : (
                            <div className="flex items-center justify-center h-full min-h-[40vh] text-foreground italic border-2 border-dashed rounded-lg">
                                Select a recipe and click 'Scale' to see results.
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
