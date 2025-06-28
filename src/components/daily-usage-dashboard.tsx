
"use client";

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { DailyUsageRecord } from '@/components/bakery-app';
import { capitalize } from '@/lib/utils';
import { LayoutDashboard, Info } from 'lucide-react';

interface DailyUsageDashboardProps {
    dailyUsageRecords: DailyUsageRecord[];
}

export default function DailyUsageDashboard({ dailyUsageRecords }: DailyUsageDashboardProps) {
    const t = useTranslations('DailyUsageDashboard');
    const tCommon = useTranslations('Common');

    return (
        <Card className="w-full max-w-4xl mx-auto glassmorphic">
            <CardHeader>
                <CardTitle>{t('title')}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2 mb-4 text-foreground">
                    <LayoutDashboard className="h-6 w-6 text-muted-foreground" />
                    <h3 className="text-xl font-semibold">{t('logsTitle', {count: dailyUsageRecords.length})}</h3>
                </div>

                {dailyUsageRecords.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {dailyUsageRecords.map(record => (
                            <AccordionItem key={record.id} value={record.id} className="bg-muted/50 border-none rounded-lg">
                                <AccordionTrigger className="p-4 hover:no-underline text-foreground font-semibold">
                                    <span>
                                        {t('logDatePrefix', {date: new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'short' }).format(record.date)})}
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent className="p-4 pt-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>{t('ingredientHeader')}</TableHead>
                                                <TableHead className="text-right">{t('amountHeader')}</TableHead>
                                                <TableHead>{t('unitHeader')}</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {record.usage.sort((a,b) => a.name.localeCompare(b.name)).map((item) => (
                                                <TableRow key={item.name}>
                                                    <TableCell className="font-medium">{capitalize(item.name)}</TableCell>
                                                    <TableCell className="text-right">{item.amount.toFixed(2)}</TableCell>
                                                    <TableCell>{item.unit}</TableCell>
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
                        <AlertTitle>{t('noDataTitle')}</AlertTitle>
                        <AlertDescription dangerouslySetInnerHTML={{ __html: t('noDataDescription') }} />
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
}
