
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { InventoryItem } from '@/lib/inventoryData';

const ingredientFormSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(2, "Ingredient name must be at least 2 characters."),
    currentStock: z.coerce.number().min(0, "Current stock must be a positive number."),
    minimumStock: z.coerce.number().min(0, "Minimum stock must be a positive number."),
    unit: z.string().min(1, "Unit is required (e.g., g, pcs, ml)."),
    orderUnit: z.string().optional(),
    orderUnitConversion: z.coerce.number().positive("Conversion must be a positive number").optional().or(z.literal('')),
});

export type IngredientFormData = Omit<InventoryItem, 'id'> & { id?: string };

interface IngredientFormProps {
    ingredientToEdit?: InventoryItem | null;
    onSubmit: (data: IngredientFormData) => void;
    onCancel: () => void;
}

export function IngredientForm({ ingredientToEdit, onSubmit, onCancel }: IngredientFormProps) {
    const form = useForm<z.infer<typeof ingredientFormSchema>>({
        resolver: zodResolver(ingredientFormSchema),
        defaultValues: ingredientToEdit ?? {
            name: '',
            currentStock: 0,
            minimumStock: 0,
            unit: 'g',
            orderUnit: '',
            orderUnitConversion: '',
        },
    });

    const handleSubmit = (data: z.infer<typeof ingredientFormSchema>) => {
        onSubmit(data as IngredientFormData);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ingredient Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Tepung" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="currentStock"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Current Stock</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" placeholder="e.g. 10000" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="minimumStock"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Base Min. Stock</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" placeholder="e.g. 5000" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                 <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Base Unit</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. g, pcs, ml" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="pt-4 mt-4 border-t">
                    <h3 className="text-md font-medium mb-2">Order Unit Conversion (Optional)</h3>
                    <p className="text-sm text-muted-foreground mb-4">Define a larger unit for easier ordering (e.g., order "1 sak" instead of "25000 g").</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="orderUnit"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Order Unit Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. sak, pack, dus" {...field} value={field.value ?? ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="orderUnitConversion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Base Units per Order Unit</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="e.g. 25000" {...field} value={field.value ?? ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>


                <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                    <Button type="submit" variant="success">Save Ingredient</Button>
                </div>
            </form>
        </Form>
    );
}
