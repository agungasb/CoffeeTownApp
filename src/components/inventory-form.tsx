
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { InventoryItem } from '@/lib/inventoryData';

const inventoryFormSchema = z.object({
    currentStock: z.coerce.number({ invalid_type_error: "Current stock is required."}).min(0, "Stock cannot be negative."),
    minimumStock: z.coerce.number({ invalid_type_error: "Minimum stock is required."}).min(0, "Stock cannot be negative."),
});

type InventoryFormData = z.infer<typeof inventoryFormSchema>;

interface InventoryFormProps {
    itemToEdit?: InventoryItem | null;
    onSubmit: (data: InventoryFormData) => void;
    onCancel: () => void;
}

export function InventoryForm({ itemToEdit, onSubmit, onCancel }: InventoryFormProps) {
    const form = useForm<InventoryFormData>({
        resolver: zodResolver(inventoryFormSchema),
        defaultValues: {
            currentStock: itemToEdit?.currentStock ?? 0,
            minimumStock: itemToEdit?.minimumStock ?? 0,
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="currentStock"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Current Stock ({itemToEdit?.unit})</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="e.g., 1000" {...field} />
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
                            <FormLabel>Minimum Stock ({itemToEdit?.unit})</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="e.g., 500" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                    <Button type="submit">Save Changes</Button>
                </div>
            </form>
        </Form>
    );
}
