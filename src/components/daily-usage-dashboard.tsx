
"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { InventoryItem } from '@/lib/inventoryData';
import { capitalize } from '@/lib/utils';
import { LayoutDashboard, ShoppingCart, ShieldAlert } from 'lucide-react';
import OrderCalculator from './order-calculator';

interface DailyUsageDashboardProps {
    inventory: InventoryItem[];
    dailyUsage: [string, number, string][];
    isLoggedIn: boolean;
}

const getStatus = (stockAfterUsage: number, minimumStock: number): { text: string; variant: "destructive" | "secondary" | "outline" } => {
    if (stockAfterUsage <= 0) return { text: 'Critical', variant: 'destructive' };
    if (stockAfterUsage <= minimumStock) return { text: 'Low', variant: 'secondary' };
    return { text: 'OK', variant: 'outline' };
};

export default function DailyUsageDashboard({ inventory, dailyUsage, isLoggedIn }: DailyUsageDashboardProps) {
    const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);

    const dashboardData = useMemo(() => {
        return inventory.map(item => {
            const usage = dailyUsage.find(u => u[0].toLowerCase() === item.name.toLowerCase())?.[1] || 0;
            const stockAfterUsage = item.currentStock - usage;
            const status = getStatus(stockAfterUsage, item.minimumStock);
            return {
                ...item,
                dailyUsage: usage,
                stockAfterUsage,
                status,
            };
        }).sort((a,b) => a.name.localeCompare(b.name));
    }, [inventory, dailyUsage]);

    return (
        <>
            <Card className="glassmorphic border-2 border-border/30 w-full max-w-6xl mx-auto">
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                    <CardTitle>Daily Usage Dashboard</CardTitle>
                    <Button onClick={() => setIsOrderDialogOpen(true)} disabled={!isLoggedIn}>
                        <ShoppingCart className="mr-2" /> Order
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2 mb-4 text-foreground">
                        <LayoutDashboard className="h-6 w-6 text-muted-foreground" />
                        <h3 className="text-xl font-semibold">Ingredient Status</h3>
                    </div>

                    {!isLoggedIn && (
                        <Alert variant="destructive" className="mb-4 bg-destructive/20 border-destructive/50">
                            <ShieldAlert className="h-4 w-4" />
                            <AlertTitle>Login Required</AlertTitle>
                            <AlertDescription>
                                Please log in to access the ordering tool.
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
                                            <TableCell className="text-right">{item.minimumStock.toLocaleString()} {item.unit}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant={item.status.variant}>{item.status.text}</Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24 text-muted-foreground italic">
                                            No inventory data available.
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
        </>
    );
}
