
"use client";

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type Recipe } from '@/lib/recipes';
import { type BaseRecipeData } from '@/lib/productIngredients';
import { capitalize } from '@/lib/utils';

const baseRecipeSchema = z.object({
    recipeName: z.string().optional(),
    weight: z.coerce.number().positive("Weight must be positive.").optional().or(z.literal('')),
});

const productFormSchema = z.object({
    name: z.string().min(3, "Product name must be at least 3 characters."),
    baseRecipes: z.array(baseRecipeSchema).optional(),
    ingredients: z.array(z.object({
        name: z.string().min(1, "Name is required."),
        amount: z.coerce.number({ invalid_type_error: "Amount is required."}).positive("Amount must be positive."),
        unit: z.string().min(1, "Unit is required."),
    })),
    calculation: z.object({
        divisor: z.coerce.number().positive("Divisor must be a positive number.").optional().or(z.literal('')),
        unit: z.string().optional(),
        multiplier: z.coerce.number().positive("Multiplier must be a positive number.").optional().or(z.literal('')),
    }).optional()
}).superRefine((data, ctx) => {
    if (data.baseRecipes) {
        data.baseRecipes.forEach((br, index) => {
            if (br.recipeName && br.recipeName !== 'none' && (br.weight === undefined || br.weight === '')) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Weight is required if a base recipe is selected.",
                    path: ["baseRecipes", index, "weight"],
                });
            }
             if ((br.weight || br.weight === 0) && (!br.recipeName || br.recipeName === 'none')) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Recipe must be selected if weight is entered.",
                    path: ["baseRecipes", index, "recipeName"],
                });
            }
        });
    }
});


type ProductFormData = z.infer<typeof productFormSchema>;

interface ProductFormProps {
    productToEdit?: { 
        name: string;
        baseRecipes?: BaseRecipeData[];
        ingredients: { name: string, amount: number, unit: string }[],
        calculation?: {
            divisor?: number,
            unit?: string,
            multiplier?: number
        }
    } | null;
    recipes: Recipe[];
    onSubmit: (data: ProductFormData) => void;
    onCancel: () => void;
}

export function ProductForm({ productToEdit, recipes, onSubmit, onCancel }: ProductFormProps) {
    const form = useForm<ProductFormData>({
        resolver: zodResolver(productFormSchema),
        defaultValues: productToEdit ? {
            ...productToEdit,
            name: productToEdit.name,
            baseRecipes: productToEdit.baseRecipes ?? [],
            calculation: productToEdit.calculation ?? { divisor: '', unit: '', multiplier: '' },
            ingredients: productToEdit.ingredients ?? [],
        } : {
            name: '',
            baseRecipes: [],
            ingredients: [{ name: '', amount: '' as any, unit: 'g' }],
            calculation: { divisor: '', unit: '', multiplier: '' }
        },
    });

    const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
        control: form.control,
        name: "ingredients",
    });

    const { fields: baseRecipeFields, append: appendBaseRecipe, remove: removeBaseRecipe } = useFieldArray({
        control: form.control,
        name: "baseRecipes"
    });

    const handleSubmit = (data: ProductFormData) => {
        onSubmit(data);
    };

    const doughRecipes = recipes.filter(r => r.name.toLowerCase().includes('adonan'));

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Abon Sosis" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="p-4 border rounded-md space-y-4 bg-muted/50">
                        <h3 className="text-md font-medium">Base Dough Recipes</h3>
                        <FormDescription>Link this product to one or more base dough recipes for automated calculations.</FormDescription>
                         {baseRecipeFields.map((field, index) => (
                            <div key={field.id} className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-4 md:gap-2 p-2 border rounded-md md:items-end bg-background/50">
                                <FormField
                                    control={form.control}
                                    name={`baseRecipes.${index}.recipeName`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Recipe</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a base recipe" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="none">None</SelectItem>
                                                    {doughRecipes.map(recipe => (
                                                        <SelectItem key={recipe.id} value={recipe.name}>
                                                            {capitalize(recipe.name)}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`baseRecipes.${index}.weight`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Dough Weight (g)</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="any" placeholder="e.g. 45" {...field} className="md:w-28" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                 <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => removeBaseRecipe(index)}
                                    className="justify-self-end md:justify-self-auto"
                                >
                                    <Trash2 />
                                </Button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => appendBaseRecipe({ recipeName: '', weight: '' })}
                            className="mt-2"
                        >
                            <PlusCircle className="mr-2" /> Add Base Recipe
                        </Button>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium mb-2">Additional Ingredients</h3>
                        <div className="space-y-4">
                            {ingredientFields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-4 md:gap-2 p-2 border rounded-md md:items-end">
                                    <FormField
                                        control={form.control}
                                        name={`ingredients.${index}.name`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ceres" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`ingredients.${index}.amount`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Amount</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="0.001" placeholder="e.g. 15" {...field} className="md:w-28"/>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                     <FormField
                                        control={form.control}
                                        name={`ingredients.${index}.unit`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Unit</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="g" {...field} className="md:w-20" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => removeIngredient(index)}
                                        className="justify-self-end md:justify-self-auto"
                                    >
                                        <Trash2 />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => appendIngredient({ name: '', amount: '' as any, unit: 'g' })}
                            className="mt-2"
                        >
                            <PlusCircle className="mr-2" /> Add Ingredient
                        </Button>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Production Calculation (Optional)</AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-4 pt-4">
                                     <FormField
                                        control={form.control}
                                        name="calculation.divisor"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Divisor</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="any" placeholder="e.g. 15" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="calculation.unit"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Metric Unit</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. loyang" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                     <FormField
                                        control={form.control}
                                        name="calculation.multiplier"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Multiplier (Optional)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="any" placeholder="e.g. 2" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                    <Button type="submit" variant="success">Save Product</Button>
                </div>
            </form>
        </Form>
    );
}
