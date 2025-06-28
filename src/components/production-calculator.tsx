
"use client";

import { useState, useTransition, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { UploadCloud, Loader2, Calculator, ShoppingBasket, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { calculateProductionMetrics, initialMetrics, productionSchema } from "@/lib/calculations";
import type { ProductionInputs } from "@/lib/calculations";
import { getQuantitiesFromImage } from "@/app/actions";
import type { ProductIngredients } from "@/lib/productIngredients";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { productItems } from "@/lib/products";
import { capitalize } from "@/lib/utils";
import type { DailyUsageRecord, DailyUsageIngredient } from "@/components/bakery-app";

type ProductionFormValues = {
  [K in keyof ProductionInputs]: number | '';
};

interface ProductionCalculatorProps {
    products: ProductIngredients;
    addDailyUsageRecord: (record: { usage: DailyUsageIngredient[] }) => Promise<void>;
    isLoggedIn: boolean;
}

export default function ProductionCalculator({ products, addDailyUsageRecord, isLoggedIn }: ProductionCalculatorProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const t = useTranslations('ProductionCalculator');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [results, setResults] = useState(initialMetrics);
  const [hasCalculated, setHasCalculated] = useState(false);

  const productList = productItems;

  const form = useForm<ProductionFormValues>({
    resolver: zodResolver(productionSchema),
    defaultValues: productList.reduce((acc, item) => ({ ...acc, [item]: '' }), {}),
  });

  const handleCalculate = (data: ProductionFormValues) => {
    const newResults = calculateProductionMetrics(data as ProductionInputs, products);
    setResults(newResults);
    setHasCalculated(true);
    toast({ title: "Success", description: t('calculationSuccess') });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const photoDataUri = e.target?.result as string;
      if (photoDataUri) {
        startTransition(async () => {
          toast({ title: "Processing...", description: t('ocrProcessing') });
          const { data, error } = await getQuantitiesFromImage(photoDataUri);
          if (error) {
            toast({ variant: "destructive", title: t('ocrFailed'), description: error });
          } else if (data) {
            let filledCount = 0;
            form.reset();
            for (const [key, value] of Object.entries(data)) {
              if (productList.includes(key)) {
                form.setValue(key as any, value, { shouldValidate: true });
                filledCount++;
              }
            }
            setHasCalculated(false); 
            toast({ title: "Success", description: t('ocrSuccess', {count: filledCount}) });
          }
        });
      }
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleSaveUsage = async () => {
    if (!results.ingredientSummary || results.ingredientSummary.length === 0) {
        toast({
            variant: "destructive",
            title: "No Data",
            description: t('noDataToSave'),
        });
        return;
    }
    const parsedUsage: DailyUsageIngredient[] = results.ingredientSummary.map(
        ([name, amountStr, unit]) => ({
            name: name,
            amount: parseFloat(amountStr) || 0,
            unit: unit
        })
    );
    
    const newRecord = {
        usage: parsedUsage
    };
    
    await addDailyUsageRecord(newRecord);
  };

  return (
    <Card className="w-full max-w-[600px] mx-auto glassmorphic">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-6">
          
          <div className="p-4 bg-muted/50 rounded-lg">
            <label className="block mb-2 text-center text-foreground font-medium">{t('uploadLabel')}</label>
             <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            <Button 
              type="button" 
              onClick={() => fileInputRef.current?.click()} 
              disabled={isPending} 
              className="w-full hover:scale-105 transition-all text-base font-medium"
            >
              {isPending ? <Loader2 className="animate-spin" /> : <UploadCloud />}
              {isPending ? t('analyzingButton') : t('uploadButton')}
            </Button>
          </div>

          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCalculate)} className="space-y-4">
                <div className="space-y-2">
                  {productList.map((item) => (
                    <FormField
                      key={item}
                      control={form.control}
                      name={item as any}
                      render={({ field }) => (
                        <FormItem className="flex justify-between items-center py-2 border-b border-border">
                            <FormLabel className="flex-grow text-left text-foreground font-medium text-sm">
                              {capitalize(item)}
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                placeholder="0"
                                className="flex-none w-20 sm:w-24 text-center rounded-md py-1 px-2 h-auto"
                                onChange={e => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                                value={field.value === 0 ? '' : field.value}
                              />
                            </FormControl>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <Button type="submit" className="w-full mt-4 hover:scale-105 transition-all text-base font-medium p-6">
                    <Calculator className="mr-2"/>
                    {t('calculateButton')}
                </Button>
              </form>
            </Form>
          </div>

          {hasCalculated ? (
            <Accordion type="multiple" defaultValue={['results', 'summary']} className="w-full space-y-4">
                <AccordionItem value="results" className="bg-background/70 border-none rounded-lg">
                    <AccordionTrigger className="p-4 hover:no-underline text-foreground font-semibold text-lg">
                        <h3 className="flex items-center gap-2"><Calculator /> {t('resultsTitle')}</h3>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 pt-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-border">
                            <TableHead className="font-semibold text-foreground">{t('metricHeader')}</TableHead>
                            <TableHead className="text-right font-semibold text-foreground">{t('resultHeader')}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {results.productionCalculations.map(([key, value]) => (
                            <TableRow key={key} className="border-border">
                                <TableCell className="font-medium text-card-foreground">{key}</TableCell>
                                <TableCell className="text-right text-card-foreground">{value}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="summary" className="bg-background/70 border-none rounded-lg">
                    <AccordionTrigger className="p-4 hover:no-underline text-foreground font-semibold text-lg">
                         <h3 className="flex items-center gap-2"><ShoppingBasket /> {t('summaryTitle')}</h3>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 pt-0">
                      <Table>
                          <TableHeader>
                          <TableRow className="border-border">
                              <TableHead className="font-semibold text-foreground">{t('ingredientHeader')}</TableHead>
                              <TableHead className="text-right font-semibold text-foreground">{t('amountHeader')}</TableHead>
                          </TableRow>
                          </TableHeader>
                          <TableBody>
                          {results.ingredientSummary.length > 0 ? (
                              results.ingredientSummary.map(([key, value, unit]) => (
                              <TableRow key={key} className="border-border">
                                  <TableCell className="font-medium text-card-foreground">{capitalize(key)}</TableCell>
                                  <TableCell className="text-right text-card-foreground">{value} {unit}</TableCell>
                              </TableRow>
                              ))
                          ) : (
                              <TableRow>
                                  <TableCell colSpan={2} className="text-center h-24 text-muted-foreground italic">
                                      {t('noIngredients')}
                                  </TableCell>
                              </TableRow>
                          )}
                          </TableBody>
                      </Table>
                       <div className="flex justify-end mt-4">
                          <Button onClick={handleSaveUsage} variant="success" disabled={!isLoggedIn}>
                              <Save className="mr-2 h-4 w-4" />
                              {t('saveUsageButton')}
                          </Button>
                      </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
          ) : (
            <div className="text-center text-muted-foreground italic py-8 border-2 border-dashed border-border rounded-lg">
              <p>{t('prompt')}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
