
"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloud, Loader2, Calculator, ShoppingBasket, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { calculateProductionMetrics, initialMetrics, createProductionSchema } from "@/lib/calculations";
import type { ProductionInputs } from "@/lib/calculations";
import { getQuantitiesFromImage } from "@/app/actions";
import type { AllProductsData } from "@/lib/productIngredients";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { capitalize } from "@/lib/utils";
import type { DailyUsageRecord, DailyUsageIngredient } from "@/components/bakery-app";

type ProductionFormValues = {
  [key: string]: number | '';
};

interface ProductionCalculatorProps {
    products: AllProductsData;
    productList: string[];
    addDailyUsageRecord: (record: { usage: DailyUsageIngredient[] }) => Promise<void>;
    isLoggedIn: boolean;
    department: 'rotiManis' | 'donut';
}

export default function ProductionCalculator({ products, productList, addDailyUsageRecord, isLoggedIn, department }: ProductionCalculatorProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [results, setResults] = useState(initialMetrics);
  const [hasCalculated, setHasCalculated] = useState(false);

  const productionSchema = createProductionSchema(productList);

  const form = useForm<ProductionFormValues>({
    resolver: zodResolver(productionSchema),
    defaultValues: productList.reduce((acc, item) => ({ ...acc, [item]: '' }), {}),
  });

  useEffect(() => {
    form.reset(productList.reduce((acc, item) => ({ ...acc, [item]: '' }), {}));
    setResults(initialMetrics);
    setHasCalculated(false);
  }, [productList, form]);

  const handleCalculate = (data: ProductionFormValues) => {
    const newResults = calculateProductionMetrics(data as ProductionInputs, products);
    setResults(newResults);
    setHasCalculated(true);
    toast({ title: "Success", description: "Calculations complete." });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const photoDataUri = e.target?.result as string;
      if (photoDataUri) {
        startTransition(async () => {
          toast({ title: "Processing...", description: "AI is analyzing your image." });
          const { data, error } = await getQuantitiesFromImage(photoDataUri);
          if (error) {
            toast({ variant: "destructive", title: "OCR Failed", description: error });
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
            toast({ title: "Success", description: `Auto-filled ${filledCount} items. Press Calculate to see results.` });
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
            description: "Calculate a production first to save the usage summary.",
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
            <label className="block mb-2 text-center text-foreground font-medium">Upload Screenshot for Auto-Fill</label>
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
              {isPending ? "Analyzing..." : "Upload & Map Quantities"}
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
                    CALCULATE
                </Button>
              </form>
            </Form>
          </div>

          {hasCalculated ? (
            <Accordion type="multiple" defaultValue={['results', 'summary']} className="w-full space-y-4">
                {department === 'rotiManis' && (
                  <AccordionItem value="results" className="bg-background/70 border-none rounded-lg">
                      <AccordionTrigger className="p-4 hover:no-underline text-foreground font-semibold text-lg">
                          <h3 className="flex items-center gap-2"><Calculator /> Calculation Results</h3>
                      </AccordionTrigger>
                      <AccordionContent className="p-4 pt-0">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-border">
                              <TableHead className="font-semibold text-foreground">Metric</TableHead>
                              <TableHead className="text-right font-semibold text-foreground">Result</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {results.productionCalculations.map(([key, value]) => (
                              <TableRow key={key} className="border-border">
                                  <TableCell className="font-medium text-card-foreground">{capitalize(key)}</TableCell>
                                  <TableCell className="text-right text-card-foreground">{value}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </AccordionContent>
                  </AccordionItem>
                )}

                <AccordionItem value="summary" className="bg-background/70 border-none rounded-lg">
                    <AccordionTrigger className="p-4 hover:no-underline text-foreground font-semibold text-lg">
                         <h3 className="flex items-center gap-2"><ShoppingBasket /> Ingredient Summary</h3>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 pt-0">
                      <Table>
                          <TableHeader>
                          <TableRow className="border-border">
                              <TableHead className="font-semibold text-foreground">Ingredient</TableHead>
                              <TableHead className="text-right font-semibold text-foreground">Total Amount</TableHead>
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
                                  <TableCell colSpan={2} className="text-center h-24 text-foreground italic">
                                      No ingredients for the entered quantities.
                                  </TableCell>
                              </TableRow>
                          )}
                          </TableBody>
                      </Table>
                       <div className="flex justify-end mt-4">
                          <Button onClick={handleSaveUsage} variant="success" disabled={!isLoggedIn}>
                              <Save className="mr-2 h-4 w-4" />
                              Save as Daily Usage
                          </Button>
                      </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
          ) : (
            <div className="text-center text-muted-foreground italic py-8 border-2 border-dashed border-border rounded-lg">
              <p>Click "Calculate" to see the results.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
