"use client";

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle, Trash2 } from 'lucide-react';

const productFormSchema = z.object({
    name: z.string().min(3, "Product name must be at least 3 characters."),
    ingredients: z.array(z.object({
        name: z.string().min(1, "Name is required."),
        amount: z.coerce.number().positive("Amount must be positive."),
    })).min(1, "A product must have at least one ingredient."),
});

type ProductFormData = z.infer<typeof productFormSchema>;

interface ProductFormProps {
    productToEdit?: { name: string, ingredients: { name: string, amount: number }[] } | null;
    onSubmit: (data: ProductFormData) => void;
    onCancel: () => void;
}

export function ProductForm({ productToEdit, onSubmit, onCancel }: ProductFormProps) {
    const form = useForm<ProductFormData>({
        resolver: zodResolver(productFormSchema),
        defaultValues: productToEdit ? {
            ...productToEdit,
            name: productToEdit.name,
        } : {
            name: '',
            ingredients: [{ name: '', amount: 1 }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "ingredients",
    });

    const handleSubmit = (data: ProductFormData) => {
        onSubmit(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                 <ScrollArea className="h-[70vh] p-1">
                    <div className="space-y-6 pr-4">
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

                        <div>
                            <h3 className="text-lg font-medium mb-2">Ingredients</h3>
                            <div className="space-y-4">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-4 md:gap-2 p-2 border rounded-md md:items-end">
                                        <FormField
                                            control={form.control}
                                            name={`ingredients.${index}.name`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Tepung" {...field} />
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
                                                    <FormLabel>Amount (g)</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" step="0.001" {...field} className="md:w-28"/>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => remove(index)}
                                            disabled={fields.length <= 1}
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
                                onClick={() => append({ name: '', amount: 1 })}
                                className="mt-2"
                            >
                                <PlusCircle className="mr-2" /> Add Ingredient
                            </Button>
                        </div>
                    </div>
                </ScrollArea>
                <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                    <Button type="submit">Save Product</Button>
                </div>
            </form>
        </Form>
    );
}
