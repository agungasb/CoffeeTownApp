
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { DailyUsageRecord } from '@/app/page';
import { capitalize } from '@/lib/utils';
import { LayoutDashboard, Info } from 'lucide-react';

interface DailyUsageDashboardProps {
    dailyUsageRecords: DailyUsageRecord[];
}

export default function DailyUsageDashboard({ dailyUsageRecords }: DailyUsageDashboardProps) {

    return (
        <Card className="w-full max-w-4xl mx-auto bg-card/90">
            <CardHeader>
                <CardTitle>Historical Usage Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2 mb-4 text-foreground">
                    <LayoutDashboard className="h-6 w-6 text-muted-foreground" />
                    <h3 className="text-xl font-semibold">Saved Usage Logs ({dailyUsageRecords.length})</h3>
                </div>

                {dailyUsageRecords.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {dailyUsageRecords.map(record => (
                            <AccordionItem key={record.id} value={record.id} className="bg-background/70 border-none rounded-lg">
                                <AccordionTrigger className="p-4 hover:no-underline text-foreground font-semibold">
                                    <span>
                                        Usage saved on: {new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'short' }).format(record.date)}
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent className="p-4 pt-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Ingredient</TableHead>
                                                <TableHead className="text-right">Total Amount</TableHead>
                                                <TableHead>Unit</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {record.usage.sort((a,b) => a[0].localeCompare(b[0])).map(([name, amount, unit]) => (
                                                <TableRow key={name}>
                                                    <TableCell className="font-medium">{capitalize(name)}</TableCell>
                                                    <TableCell className="text-right">{amount.toFixed(2)}</TableCell>
                                                    <TableCell>{unit}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                ) : (
                    <Alert className="mt-4 bg-muted/30 border-border/50">
                        <Info className="h-4 w-4" />
                        <AlertTitle>No Usage Data Found</AlertTitle>
                        <AlertDescription>
                            To view historical data, go to the <strong>Production Calculator</strong> tab, enter your production quantities, calculate the results, and then click "Save as Daily Usage". Your saved summaries will appear here.
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
}
