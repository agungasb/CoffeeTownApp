
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";

export default function Inventory() {
    return (
        <Card className="glassmorphic border-2 border-border/30 w-full max-w-6xl mx-auto">
            <CardHeader>
                <CardTitle>Inventory</CardTitle>
                <CardDescription>Manage your ingredient stock levels.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center h-40 text-muted-foreground italic border-2 border-dashed rounded-lg">
                    <Construction className="h-12 w-12 mb-4" />
                    <p>Inventory Management Feature Coming Soon</p>
                </div>
            </CardContent>
        </Card>
    );
}
