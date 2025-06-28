
"use client";

import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calculator, PackagePlus, ArrowLeft, CalendarDays } from "lucide-react";
import type { InventoryItem } from "@/lib/inventoryData";
import type { DailyUsageRecord, DailyUsageIngredient } from "@/components/bakery-app";
import { capitalize, calculateAverageDailyUsage } from "@/lib/utils";

interface OrderCalculatorProps {
    inventory: InventoryItem[];
    dailyUsageRecords: DailyUsageRecord[];
}

interface OrderRecommendation {
    name: string;
    amountToOrder: number;
    unit: string;
}

type FormValues = {
    [key: string]: number | string;
};

export function OrderCalculator({ inventory, dailyUsageRecords }: OrderCalculatorProps) {
    const [recommendations, setRecommendations] = useState<OrderRecommendation[] | null>(null);
    const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay());
    const [averageUsage, setAverageUsage] = useState<DailyUsageIngredient[]>([]);

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    useEffect(() => {
        const usage = calculateAverageDailyUsage(dailyUsageRecords, selectedDay);
        setAverageUsage(usage);
    }, [selectedDay, dailyUsageRecords]);

    const sortedInventory = useMemo(() => {
        return [...inventory].sort((a, b) => a.name.localeCompare(b.name));
    }, [inventory]);

    const defaultValues = useMemo(() => sortedInventory.reduce((acc, item) => {
        acc[item.id] = '';
        return acc;
    }, {} as FormValues), [sortedInventory]);

    const form = useForm<FormValues>({ defaultValues });

     useEffect(() => {
        form.reset(defaultValues);
    }, [sortedInventory, form, defaultValues]);

    const handleCalculate = (data: FormValues) => {
        const newRecommendations: OrderRecommendation[] = [];

        inventory.forEach(item => {
            const stockInputValue = data[item.id];
            const hasUserInput = stockInputValue !== '' && stockInputValue !== undefined;

            const stockInDisplayUnits = hasUserInput
                ? Number(stockInputValue)
                : (item.orderUnit && item.orderUnitConversion)
                    ? item.currentStock / item.orderUnitConversion
                    : item.currentStock;
            
            const currentStockInBaseUnit = (item.orderUnit && item.orderUnitConversion)
                ? stockInDisplayUnits * item.orderUnitConversion
                : stockInDisplayUnits;

            const usageAmount = averageUsage.find(u => u.name.toLowerCase() === item.name.toLowerCase())?.amount || 0;
            const stockAfterUsage = currentStockInBaseUnit - usageAmount;

            if (stockAfterUsage < item.minimumStock) {
                const amountToOrder = Math.ceil((item.minimumStock + usageAmount) - currentStockInBaseUnit);
                if (amountToOrder > 0) {
                     if (item.orderUnit && item.orderUnitConversion && item.orderUnitConversion > 0) {
                        const convertedAmount = amountToOrder / item.orderUnitConversion;
                        newRecommendations.push({
                            name: item.name,
                            amountToOrder: convertedAmount,
                            unit: item.orderUnit
                        });
                    } else {
                        newRecommendations.push({
                            name: item.name,
                            amountToOrder,
                            unit: item.unit
                        });
                    }
                }
            }
        });
        setRecommendations(newRecommendations.sort((a, b) => a.name.localeCompare(b.name)));
    };
    
    if (recommendations) {
        return (
            <div className="space-y-4">
                <Alert>
                    <CalendarDays className="h-4 w-4" />
                    <AlertTitle>Order Recommendation for {daysOfWeek[selectedDay]}</AlertTitle>
                    <AlertDescription>
                        Based on an average usage of {averageUsage.length > 0 ? 'the last four relevant days.' : '0'} saved records for this day.
                    </AlertDescription>
                </Alert>

                <div className="max-h-[50vh] overflow-y-auto pr-4">
                    {recommendations.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Ingredient</TableHead>
                                        <TableHead className="text-right">Recommended Order Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recommendations.map(rec => (
                                        <TableRow key={rec.name}>
                                            <TableCell>{capitalize(rec.name)}</TableCell>
                                            <TableCell className="text-right font-bold">
                                                {Number.isInteger(rec.amountToOrder) ? rec.amountToOrder.toLocaleString() : rec.amountToOrder.toFixed(2)} {rec.unit}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                    ) : (
                        <Alert>
                            <PackagePlus className="h-4 w-4" />
                            <AlertTitle>All stock is sufficient!</AlertTitle>
                            <AlertDescription>No order recommendations at this time based on your current stock and forecast.</AlertDescription>
                        </Alert>
                    )}
                </div>
                <Button onClick={() => setRecommendations(null)} variant="outline">
                    <ArrowLeft className="mr-2" /> Recalculate
                </Button>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCalculate)} className="space-y-6">
                <div className="space-y-2">
                    <Label>Select Day for Forecast</Label>
                    <Select onValueChange={(val) => setSelectedDay(Number(val))} defaultValue={String(selectedDay)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a day" />
                        </SelectTrigger>
                        <SelectContent>
                            {daysOfWeek.map((day, index) => (
                                <SelectItem key={day} value={String(index)}>{day}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">The calculation will use the average of the last 4 saved usages for the selected day.</p>
                </div>

                 <div className="max-h-[50vh] overflow-y-auto pr-4 space-y-4 border-t pt-4">
                    <h3 className="text-lg font-medium">Enter Current Stock Levels (Optional)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-4">
                        {sortedInventory.map(item => {
                            const unitLabel = (item.orderUnit && item.orderUnitConversion) ? item.orderUnit : item.unit;
                            
                            const stockInDisplayUnit = (item.orderUnit && item.orderUnitConversion)
                                ? (item.currentStock / item.orderUnitConversion)
                                : item.currentStock;
                            
                            const hintValue = Number(stockInDisplayUnit.toFixed(2));

                            return (
                                <FormField
                                    key={item.id}
                                    control={form.control}
                                    name={item.id}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{capitalize(item.name)} (in {unitLabel})</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="any"
                                                    placeholder={`Hint: ${hintValue}`}
                                                    {...field}
                                                    onChange={e => field.onChange(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                                    value={field.value ?? ''}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            );
                        })}
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
