
"use client";

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Recipe } from '@/lib/recipes';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Textarea } from './ui/textarea';

const recipeFormSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(3, "Recipe name must be at least 3 characters."),
    baseWeight: z.coerce.number().positive("Base weight must be a positive number.").optional().or(z.literal('')),
    ingredients: z.array(z.object({
        name: z.string().min(1, "Name is required."),
        amount: z.coerce.number({invalid_type_error: "Amount is required."}).gt(0, { message: "Amount must be greater than 0." }),
        unit: z.string().min(1, "Unit is required."),
    })).min(1, "A recipe must have at least one ingredient."),
    steps: z.array(z.string().min(3, "Step must be at least 3 characters long.")).min(1, "A recipe must have at least one step."),
});

export type RecipeFormData = z.infer<typeof recipeFormSchema>;

interface RecipeFormProps {
    recipeToEdit?: Recipe | null;
    onSubmit: (data: RecipeFormData) => void;
    onCancel: () => void;
}

export function RecipeForm({ recipeToEdit, onSubmit, onCancel }: RecipeFormProps) {
    const form = useForm<RecipeFormData>({
        resolver: zodResolver(recipeFormSchema),
        mode: 'onBlur',
        defaultValues: recipeToEdit ? {
            ...recipeToEdit,
            baseWeight: recipeToEdit.baseWeight ?? '',
        } : {
            name: '',
            baseWeight: '',
            ingredients: [{ name: '', amount: '' as any, unit: 'g' }],
            steps: [''],
        },
    });

    const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
        control: form.control,
        name: "ingredients",
    });

    const { fields: stepFields, append: appendStep, remove: removeStep } = useFieldArray({
        control: form.control,
        name: "steps",
    });


    const handleSubmit = (data: RecipeFormData) => {
        onSubmit(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Recipe Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Chocolate Chip Cookies" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="baseWeight"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Base Weight Override (g)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" placeholder="Leave blank to auto-calculate" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Optionally, set a fixed base weight. If left blank, it will be calculated from the sum of ingredients.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div>
                        <h3 className="text-lg font-medium mb-2">Ingredients</h3>
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
                                                    <Input placeholder="e.g. Flour" {...field} />
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
                                                    <Input type="number" step="0.01" placeholder="e.g. 100" {...field} />
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
                                                    <Input placeholder="grams" {...field} className="md:w-24" />
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

                     <div>
                        <h3 className="text-lg font-medium mb-2">Instructions</h3>
                        <div className="space-y-4">
                            {stepFields.map((field, index) => (
                                 <div key={field.id} className="flex items-start gap-2">
                                    <span className="font-bold pt-2">{index + 1}.</span>
                                    <FormField
                                        control={form.control}
                                        name={`steps.${index}`}
                                        render={({ field }) => (
                                            <FormItem className="flex-grow">
                                                <FormControl>
                                                    <Textarea placeholder="Mix all dry ingredients..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                     <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => removeStep(index)}
                                        className="shrink-0 mt-1"
                                    >
                                        <Trash2 />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => appendStep('')}
                            className="mt-2"
                        >
                            <PlusCircle className="mr-2" /> Add Step
                        </Button>
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                    <Button type="submit" variant="success">Save Recipe</Button>
                </div>
            </form>
        </Form>
    );
}
