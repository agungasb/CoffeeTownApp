
"use client";

import { useState, useMemo } from 'react';
import type { DailyUsageRecord } from '@/components/bakery-app';
import type { InventoryItem } from '@/lib/inventoryData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PlusCircle, Edit, Trash2, ShieldAlert, Package, Warehouse, Info } from 'lucide-react';
import { IngredientForm, type IngredientFormData } from './ingredient-form';
import { OrderCalculator } from './order-calculator';
import { capitalize, calculateAverageDailyUsage } from '@/lib/utils';

interface InventoryManagerProps {
    inventory: InventoryItem[];
    addInventoryItem: (itemData: IngredientFormData) => Promise<void>;
    updateInventoryItem: (item: InventoryItem) => Promise<void>;
    deleteInventoryItem: (itemId: string) => Promise<void>;
    dailyUsageRecords: DailyUsageRecord[];
    resetDailyUsage: () => Promise<void>;
    isLoggedIn: boolean;
}

export default function InventoryManager({ inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem, dailyUsageRecords, resetDailyUsage, isLoggedIn }: InventoryManagerProps) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isOrderOpen, setIsOrderOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState<InventoryItem | null>(null);

    const sortedInventory = useMemo(() => [...inventory].sort((a, b) => a.name.localeCompare(b.name)), [inventory]);
    
    const averageUsageToday = useMemo(() => {
        const today = new Date().getDay();
        return calculateAverageDailyUsage(dailyUsageRecords, today);
    }, [dailyUsageRecords]);
    
    const handleAddClick = () => {
        setItemToEdit(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (item: InventoryItem) => {
        setItemToEdit(item);
        setIsFormOpen(true);
    };

    const handleDelete = async (itemId: string) => {
        await deleteInventoryItem(itemId);
    };

    const handleFormSubmit = async (data: IngredientFormData) => {
        if (itemToEdit) {
            await updateInventoryItem({ ...data, id: itemToEdit.id });
        } else {
            await addInventoryItem(data);
        }
        
        setIsFormOpen(false);
        setItemToEdit(null);
    };

    const getStatus = (item: InventoryItem): { text: string, variant: "default" | "secondary" | "destructive" } => {
        const usage = averageUsageToday.find(u => u.name === item.name)?.[1] || 0;
        if (item.currentStock < item.minimumStock) {
            return { text: "Critical", variant: "destructive" };
        }
        if (item.currentStock < item.minimumStock + usage) {
            return { text: "Low", variant: "secondary" };
        }
        return { text: "In Stock", variant: "default" };
    }

    const handleResetUsage = async () => {
        await resetDailyUsage();
    };

    return (
        <>
            <Card className="w-full max-w-7xl mx-auto bg-card/90">
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <CardTitle>Inventory Management</CardTitle>
                    <div className="flex flex-wrap gap-2">
                        <Button onClick={handleAddClick} disabled={!isLoggedIn} size="sm" variant="success">
                            <PlusCircle className="mr-2" /> Add New Ingredient
                        </Button>
                        <Button onClick={() => setIsOrderOpen(true)} variant="secondary" size="sm">
                            <Package className="mr-2" /> Order
                        </Button>
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm" disabled={!isLoggedIn}>
                                    <Trash2 className="mr-2" /> Reset Usage Data
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="glassmorphic">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete all
                                        historical daily usage records. This data is used for the Order Recommendation Calculator.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleResetUsage} className="bg-destructive hover:bg-destructive/90">
                                        Yes, delete all usage data
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2 mb-4 text-foreground">
                        <Warehouse className="h-6 w-6 text-muted-foreground" />
                        <h3 className="text-xl font-semibold">Ingredient Stock ({inventory.length})</h3>
                    </div>
                    {!isLoggedIn && (
                        <Alert variant="destructive" className="mb-4 bg-destructive/20 border-destructive/50">
                            <ShieldAlert className="h-4 w-4" />
                            <AlertTitle>Login Required</AlertTitle>
                            <AlertDescription>
                                Please log in to manage inventory.
                            </AlertDescription>
                        </Alert>
                    )}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ingredient</TableHead>
                                <TableHead>Current Stock</TableHead>
                                <TableHead>Min. Stock</TableHead>
                                <TableHead>Avg. Daily Usage</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedInventory.map(item => {
                                const usage = averageUsageToday.find(u => u.name === item.name);
                                const status = getStatus(item);
                                return (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{capitalize(item.name)}</TableCell>
                                    <TableCell>{item.currentStock.toLocaleString()} {item.unit}</TableCell>
                                    <TableCell>{item.minimumStock.toLocaleString()} {item.unit}</TableCell>
                                    <TableCell>{usage ? `${usage.amount.toFixed(2)} ${usage.unit}` : 'N/A'}</TableCell>
                                    <TableCell><Badge variant={status.variant}>{status.text}</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="info" size="icon" onClick={() => handleEditClick(item)} disabled={!isLoggedIn}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="icon" disabled={!isLoggedIn}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="glassmorphic">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This will permanently delete the ingredient "{capitalize(item.name)}".
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
                                    </TableCell>
                                </TableRow>
                            )})}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-md glassmorphic">
                    <DialogHeader>
                        <DialogTitle>{itemToEdit ? 'Edit Ingredient' : 'Add New Ingredient'}</DialogTitle>
                    </DialogHeader>
                    <IngredientForm 
                        ingredientToEdit={itemToEdit}
                        onSubmit={handleFormSubmit}
                        onCancel={() => setIsFormOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={isOrderOpen} onOpenChange={setIsOrderOpen}>
                <DialogContent className="max-w-3xl glassmorphic">
                    <DialogHeader>
                        <DialogTitle>Order Recommendation Calculator</DialogTitle>
                    </DialogHeader>
                    {dailyUsageRecords.length > 0 ? (
                        <OrderCalculator 
                            inventory={inventory}
                            dailyUsageRecords={dailyUsageRecords}
                        />
                    ) : (
                        <Alert className="mt-4 bg-muted/30 border-border/50">
                            <Info className="h-4 w-4" />
                            <AlertTitle>No Usage Data Found</AlertTitle>
                            <AlertDescription>
                                To use the order calculator, go to the <strong>Production Calculator</strong> tab, enter production quantities, calculate the results, and then "Save as Daily Usage". You need at least one saved record to generate recommendations.
                            </AlertDescription>
                        </Alert>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
