
"use client";

import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, PackagePlus, ArrowLeft, CalendarDays } from "lucide-react";
import type { InventoryItem } from "@/lib/inventoryData";
import type { DailyUsageRecord } from "@/app/page";
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

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function OrderCalculator({ inventory, dailyUsageRecords }: OrderCalculatorProps) {
    const [recommendations, setRecommendations] = useState<OrderRecommendation[] | null>(null);
    const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay());
    const [averageUsage, setAverageUsage] = useState<[string, number, string][]>([]);
    
    useEffect(() => {
        const usage = calculateAverageDailyUsage(dailyUsageRecords, selectedDay);
        setAverageUsage(usage);
    }, [selectedDay, dailyUsageRecords]);

    const sortedInventory = useMemo(() => {
        return [...inventory].sort((a, b) => a.name.localeCompare(b.name));
    }, [inventory]);

    const defaultValues = useMemo(() => sortedInventory.reduce((acc, item) => {
        acc[item.id] = item.currentStock || '';
        return acc;
    }, {} as FormValues), [sortedInventory]);

    const form = useForm<FormValues>({ defaultValues });

    useEffect(() => {
        form.reset(defaultValues);
    }, [inventory, form, defaultValues]);

    const handleCalculate = (data: FormValues) => {
        const newRecommendations: OrderRecommendation[] = [];

        sortedInventory.forEach(item => {
            const currentStock = Number(data[item.id]) || 0;
            const usageAmount = averageUsage.find(u => u[0].toLowerCase() === item.name.toLowerCase())?.[1] || 0;
            const stockAfterUsage = currentStock - usageAmount;

            if (stockAfterUsage < item.minimumStock) {
                const amountToOrder = Math.ceil((item.minimumStock + usageAmount) - currentStock);
                if (amountToOrder > 0) {
                    newRecommendations.push({
                        name: item.name,
                        amountToOrder,
                        unit: item.unit
                    });
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
                        Based on an average usage of {averageUsage.length > 0 ? 'the last four relevant days.' : '0 saved records for this day.'}
                    </AlertDescription>
                </Alert>

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
                            No order recommendations at this time based on your current stock and forecast.
                        </AlertDescription>
                    </Alert>
                )}
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
                    <p className="text-sm text-muted-foreground">
                        The calculation will use the average of the last 4 saved usages for the selected day.
                    </p>
                </div>

                 <div className="max-h-[50vh] overflow-y-auto pr-4 space-y-4 border-t pt-4">
                    <h3 className="text-lg font-medium">Enter Current Stock Levels</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        {sortedInventory.map(item => (
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
