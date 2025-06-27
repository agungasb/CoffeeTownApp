
"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { InventoryItem } from '@/lib/inventoryData';
import { capitalize } from '@/lib/utils';
import { LayoutDashboard, ShoppingCart, ShieldAlert, PlusCircle, Edit, Trash2 } from 'lucide-react';
import OrderCalculator from './order-calculator';
import { IngredientForm, type IngredientFormData } from './ingredient-form';
import { useToast } from '@/hooks/use-toast';


interface DailyUsageDashboardProps {
    inventory: InventoryItem[];
    setInventory: (inventory: InventoryItem[]) => void;
    dailyUsage: [string, number, string][];
    isLoggedIn: boolean;
}

const getStatus = (stockAfterUsage: number, minimumStock: number): { text: string; variant: "destructive" | "secondary" | "outline" } => {
    if (stockAfterUsage <= 0) return { text: 'Critical', variant: 'destructive' };
    if (stockAfterUsage < minimumStock) return { text: 'Low', variant: 'secondary' };
    return { text: 'OK', variant: 'outline' };
};

export default function DailyUsageDashboard({ inventory, setInventory, dailyUsage, isLoggedIn }: DailyUsageDashboardProps) {
    const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
    const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState<InventoryItem | null>(null);
    const { toast } = useToast();

    const dashboardData = useMemo(() => {
        return inventory.map(inventoryItem => {
            const name = inventoryItem.name.toLowerCase();
            const usageData = dailyUsage.find(u => u[0].toLowerCase() === name);

            const usage = usageData ? usageData[1] : 0;
            const unit = inventoryItem.unit;
            const currentStock = inventoryItem.currentStock;
            
            const minimumStockToUse = usage > 0 ? usage : inventoryItem.minimumStock;
            const stockAfterUsage = currentStock - usage;
            const status = getStatus(stockAfterUsage, minimumStockToUse);

            return {
                ...inventoryItem,
                name: inventoryItem.name,
                currentStock,
                minimumStock: minimumStockToUse,
                unit,
                dailyUsage: usage,
                stockAfterUsage,
                status,
            };
        }).sort((a,b) => a.name.localeCompare(b.name));
    }, [inventory, dailyUsage]);

    const handleAddClick = () => {
        setItemToEdit(null);
        setIsFormDialogOpen(true);
    };

    const handleEditClick = (item: InventoryItem) => {
        const originalItem = inventory.find(i => i.id === item.id) || item;
        setItemToEdit(originalItem);
        setIsFormDialogOpen(true);
    };

    const handleDelete = (itemId: string) => {
        setInventory(inventory.filter(i => i.id !== itemId));
        toast({ title: 'Success', description: 'Ingredient deleted.' });
    };

    const handleFormSubmit = (data: IngredientFormData) => {
        if (itemToEdit) {
            setInventory(inventory.map(i => i.id === itemToEdit.id ? { ...i, ...data } : i));
            toast({ title: 'Success', description: 'Ingredient updated.' });
        } else {
            const newIngredient: InventoryItem = {
                ...data,
                id: `ing-${Date.now()}-${data.name.replace(/\s+/g, '-')}`
            };
            setInventory([...inventory, newIngredient]);
            toast({ title: 'Success', description: 'Ingredient added.' });
        }
        setIsFormDialogOpen(false);
        setItemToEdit(null);
    };


    return (
        <>
            <Card className="glassmorphic border-2 border-border/30 w-full max-w-6xl mx-auto">
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                    <CardTitle>Ingredient Dashboard</CardTitle>
                    <div className="flex items-center gap-2">
                         <Button onClick={handleAddClick} disabled={!isLoggedIn} variant="outline">
                            <PlusCircle className="mr-2" /> Add Ingredient
                        </Button>
                        <Button onClick={() => setIsOrderDialogOpen(true)} disabled={!isLoggedIn}>
                            <ShoppingCart className="mr-2" /> Order
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2 mb-4 text-foreground">
                        <LayoutDashboard className="h-6 w-6 text-muted-foreground" />
                        <h3 className="text-xl font-semibold">Ingredient Status ({dashboardData.length})</h3>
                    </div>

                    {!isLoggedIn && (
                        <Alert variant="destructive" className="mb-4 bg-destructive/20 border-destructive/50">
                            <ShieldAlert className="h-4 w-4" />
                            <AlertTitle>Login Required</AlertTitle>
                            <AlertDescription>
                                Please log in to manage inventory or use the ordering tool.
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ingredient</TableHead>
                                    <TableHead className="text-right">Current Stock</TableHead>
                                    <TableHead className="text-right">Daily Usage</TableHead>
                                    <TableHead className="text-right">Est. Stock After Usage</TableHead>
                                    <TableHead className="text-right">Min. Stock</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {dashboardData.length > 0 ? (
                                    dashboardData.map(item => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{capitalize(item.name)}</TableCell>
                                            <TableCell className="text-right">{item.currentStock.toLocaleString()} {item.unit}</TableCell>
                                            <TableCell className="text-right">{item.dailyUsage.toFixed(2)} {item.unit}</TableCell>
                                            <TableCell className="text-right font-bold">{item.stockAfterUsage.toLocaleString(undefined, {maximumFractionDigits: 2})} {item.unit}</TableCell>
                                            <TableCell className="text-right">{item.minimumStock.toLocaleString(undefined, {maximumFractionDigits: 2})} {item.unit}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant={item.status.variant}>{item.status.text}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right py-1">
                                                <div className="flex justify-end items-center gap-1">
                                                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(item)} disabled={!isLoggedIn}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="icon" disabled={!isLoggedIn}>
                                                                <Trash2 className="h-4 w-4 text-destructive" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent className="glassmorphic">
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This action cannot be undone. This will permanently delete the ingredient "{capitalize(item.name)}".
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDelete(item.id)} className="bg-destructive hover:bg-destructive/90">
                                                                    Delete
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center h-24 text-muted-foreground italic">
                                            No inventory data available. Add an ingredient to get started.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
                <DialogContent className="max-w-3xl glassmorphic">
                    <DialogHeader>
                        <DialogTitle>Order Recommendation Calculator</DialogTitle>
                        <DialogDescription>
                            Input your current physical stock to get an order recommendation based on the saved daily usage.
                        </DialogDescription>
                    </DialogHeader>
                    <OrderCalculator inventory={inventory} dailyUsage={dailyUsage} />
                </DialogContent>
            </Dialog>
            <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
                <DialogContent className="sm:max-w-md glassmorphic">
                    <DialogHeader>
                        <DialogTitle>{itemToEdit ? 'Edit Ingredient' : 'Add New Ingredient'}</DialogTitle>
                    </DialogHeader>
                    <IngredientForm
                        ingredientToEdit={itemToEdit}
                        onSubmit={handleFormSubmit}
                        onCancel={() => setIsFormDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}
