
"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { type InventoryItem } from "@/lib/inventoryData";
import { capitalize } from "@/lib/utils";
import { Edit, PackageOpen, ShieldAlert, Warehouse } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { InventoryForm } from "./inventory-form";

interface InventoryProps {
    inventory: InventoryItem[];
    setInventory: (inventory: InventoryItem[]) => void;
    isLoggedIn: boolean;
}

type StatusFilter = "all" | "low" | "out";

const getStatus = (item: InventoryItem): { text: string, variant: "default" | "secondary" | "destructive" } => {
    if (item.currentStock <= 0) return { text: 'Out of Stock', variant: 'destructive' };
    if (item.currentStock <= item.minimumStock) return { text: 'Low Stock', variant: 'secondary' };
    return { text: 'In Stock', variant: 'outline' };
};

export default function Inventory({ inventory, setInventory, isLoggedIn }: InventoryProps) {
    const { toast } = useToast();
    const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState<InventoryItem | null>(null);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

    const handleEditClick = (item: InventoryItem) => {
        setItemToEdit(item);
        setIsFormDialogOpen(true);
    };

    const handleFormSubmit = (data: { currentStock: number; minimumStock: number }) => {
        if (!itemToEdit) return;

        const updatedInventory = inventory.map(item =>
            item.id === itemToEdit.id ? { ...item, ...data } : item
        );
        setInventory(updatedInventory);
        toast({ title: "Success", description: `Updated stock for ${capitalize(itemToEdit.name)}.` });
        setIsFormDialogOpen(false);
        setItemToEdit(null);
    };

    const filteredInventory = useMemo(() => {
        if (statusFilter === 'all') return inventory;
        return inventory.filter(item => {
            const status = getStatus(item).text.toLowerCase().replace(' ', '');
            if(statusFilter === 'low') return status === 'lowstock';
            if(statusFilter === 'out') return status === 'outofstock';
            return false;
        });
    }, [inventory, statusFilter]);

    return (
        <Card className="glassmorphic border-2 border-border/30 w-full max-w-6xl mx-auto">
            <CardHeader>
                <CardTitle>Inventory Management</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-2 text-foreground">
                        <Warehouse className="h-6 w-6 text-muted-foreground" />
                        <h3 className="text-xl font-semibold">Ingredients ({filteredInventory.length} of {inventory.length})</h3>
                    </div>
                     <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Filter by status:</span>
                        <Select onValueChange={(value) => setStatusFilter(value as StatusFilter)} defaultValue="all">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="low">Low Stock</SelectItem>
                                <SelectItem value="out">Out of Stock</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                 {!isLoggedIn && (
                    <Alert variant="destructive" className="mb-4 bg-destructive/20 border-destructive/50">
                        <ShieldAlert className="h-4 w-4" />
                        <AlertTitle>Login Required</AlertTitle>
                        <AlertDescription>
                            Please log in to edit stock levels.
                        </AlertDescription>
                    </Alert>
                )}

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ingredient</TableHead>
                                <TableHead className="text-right">Current Stock</TableHead>
                                <TableHead className="text-right">Min. Stock</TableHead>
                                <TableHead>Unit</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredInventory.length > 0 ? (
                                filteredInventory.sort((a, b) => a.name.localeCompare(b.name)).map(item => {
                                    const status = getStatus(item);
                                    return (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{capitalize(item.name)}</TableCell>
                                            <TableCell className="text-right">{item.currentStock.toLocaleString()}</TableCell>
                                            <TableCell className="text-right">{item.minimumStock.toLocaleString()}</TableCell>
                                            <TableCell>{item.unit}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant={status.variant}>{status.text}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="outline" size="sm" onClick={() => handleEditClick(item)} disabled={!isLoggedIn}>
                                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                                </Button>
                                                <Button variant="secondary" size="sm" className="ml-2" disabled>
                                                    <PackageOpen className="mr-2 h-4 w-4" /> Order
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                             ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground italic">
                                        No ingredients match the current filter.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                 <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
                    <DialogContent className="sm:max-w-md glassmorphic">
                        <DialogHeader>
                            <DialogTitle>Edit Stock: {capitalize(itemToEdit?.name ?? '')}</DialogTitle>
                        </DialogHeader>
                        <InventoryForm
                            itemToEdit={itemToEdit}
                            onSubmit={handleFormSubmit}
                            onCancel={() => setIsFormDialogOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
