
"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calculator, PackagePlus, ArrowLeft } from "lucide-react";
import type { InventoryItem } from "@/lib/inventoryData";
import { capitalize } from "@/lib/utils";

interface OrderCalculatorProps {
    inventory: InventoryItem[];
    dailyUsage: [string, number, string][];
}

interface OrderRecommendation {
    name: string;
    amountToOrder: number;
    unit: string;
}

type FormValues = {
    [key: string]: number | string;
};

export default function OrderCalculator({ inventory, dailyUsage }: OrderCalculatorProps) {
    const [recommendation, setRecommendation] = useState<OrderRecommendation[] | null>(null);

    const combinedInventory = useMemo(() => {
        const allIngredientNames = [
            ...new Set([
                ...inventory.map(i => i.name.toLowerCase()),
                ...dailyUsage.map(u => u[0].toLowerCase())
            ])
        ];

        return allIngredientNames.map(name => {
            const inventoryItem = inventory.find(i => i.name.toLowerCase() === name);
            const usageData = dailyUsage.find(u => u[0].toLowerCase() === name);

            const id = inventoryItem?.id || name.replace(/\s+/g, '-');
            const unit = inventoryItem?.unit || usageData?.[2] || 'g';
            const currentStock = inventoryItem?.currentStock || 0;
            const minimumStock = inventoryItem?.minimumStock || 0;
            
            return {
                id,
                name: name,
                currentStock,
                minimumStock,
                unit
            };
        }).sort((a, b) => a.name.localeCompare(b.name));
    }, [inventory, dailyUsage]);

    const defaultValues = combinedInventory.reduce((acc, item) => {
        acc[item.id] = item.currentStock || '';
        return acc;
    }, {} as FormValues);

    const form = useForm<FormValues>({ defaultValues });

    const handleCalculate = (data: FormValues) => {
        const recommendations: OrderRecommendation[] = [];

        combinedInventory.forEach(item => {
            const currentStock = Number(data[item.id]) || 0;
            const usageAmount = dailyUsage.find(u => u[0].toLowerCase() === item.name.toLowerCase())?.[1] || 0;
            const stockAfterUsage = currentStock - usageAmount;

            if (stockAfterUsage < item.minimumStock) {
                const amountToOrder = Math.ceil(item.minimumStock - stockAfterUsage);
                if (amountToOrder > 0) {
                    recommendations.push({
                        name: item.name,
                        amountToOrder,
                        unit: item.unit
                    });
                }
            }
        });
        setRecommendation(recommendations.sort((a, b) => a.name.localeCompare(b.name)));
    };
    
    if (recommendation) {
        return (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Order Recommendation</h3>
                {recommendation.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ingredient</TableHead>
                                <TableHead className="text-right">Recommended Order Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recommendation.map(rec => (
                                <TableRow key={rec.name}>
                                    <TableCell>{capitalize(rec.name)}</TableCell>
                                    <TableCell className="text-right font-bold">{rec.amountToOrder.toLocaleString()} {rec.unit}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <Alert>
                        <PackagePlus className="h-4 w-4" />
                        <AlertTitle>All stock is sufficient!</AlertTitle>
                        <AlertDescription>
                            No order recommendations at this time based on your current stock and daily usage.
                        </AlertDescription>
                    </Alert>
                )}
                <Button onClick={() => setRecommendation(null)} variant="outline">
                    <ArrowLeft className="mr-2" /> Recalculate
                </Button>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCalculate)} className="space-y-6">
                 <div className="max-h-[50vh] overflow-y-auto pr-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        {combinedInventory.map(item => (
                            <FormField
                                key={item.id}
                                control={form.control}
                                name={item.id}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{capitalize(item.name)} (in {item.unit})</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder={`Current stock of ${item.name}`}
                                                {...field}
                                                onChange={e => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        ))}
                    </div>
                </div>
                <div className="flex justify-end pt-4 border-t">
                    <Button type="submit">
                        <Calculator className="mr-2"/>
                        Calculate Recommendation
                    </Button>
                </div>
            </form>
        </Form>
    );
}
