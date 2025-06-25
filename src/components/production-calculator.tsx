
"use client";

import { useState, useTransition, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloud, Loader2, Calculator, ShoppingBasket } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { calculateProductionMetrics, initialMetrics, productionSchema } from "@/lib/calculations";
import type { ProductionInputs } from "@/lib/calculations";
import { getQuantitiesFromImage } from "@/app/actions";
import { ScrollArea } from "./ui/scroll-area";
import type { ProductIngredients } from "@/lib/productIngredients";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { productItems } from "@/lib/products";

const capitalize = (s: string) => s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

type ProductionFormValues = {
  [K in keyof ProductionInputs]: number | '';
};

interface ProductionCalculatorProps {
    products: ProductIngredients;
}

export default function ProductionCalculator({ products }: ProductionCalculatorProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
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
            setHasCalculated(false); // Reset calculation state after auto-fill
            toast({ title: "Success", description: `Auto-filled ${filledCount} items. Press Calculate to see results.` });
          }
        });
      }
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  return (
    <Card className="glassmorphic border-2 border-border/30 w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Production Quantities</CardTitle>
        <CardDescription>Enter product quantities or upload an image to auto-fill.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-8">
          
          <div>
            <div className="mb-4">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <Button type="button" onClick={() => fileInputRef.current?.click()} disabled={isPending} className="w-full">
                {isPending ? <Loader2 className="animate-spin" /> : <UploadCloud />}
                Upload Screenshot for Auto-Fill
              </Button>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCalculate)} className="space-y-6">
                <ScrollArea className="h-[50vh] pr-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {productList.map((item) => (
                      <FormField
                        key={item}
                        control={form.control}
                        name={item as any}
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between">
                              <FormLabel>{item.split(' ').map(capitalize).join(' ')}</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  {...field} 
                                  placeholder="0"
                                  className="w-24"
                                  onChange={e => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                                  value={field.value === 0 ? '' : field.value}
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </ScrollArea>
                <Button type="submit" className="w-full">
                    <Calculator className="mr-2"/>
                    Calculate
                </Button>
              </form>
            </Form>
          </div>

          {hasCalculated ? (
            <Accordion type="multiple" defaultValue={['results', 'summary']} className="w-full space-y-4">
                <AccordionItem value="results" className="glassmorphic border rounded-lg">
                    <AccordionTrigger className="p-4 hover:no-underline">
                        <h3 className="text-lg font-semibold flex items-center gap-2"><Calculator /> Calculation Results</h3>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 pt-0">
                        <ScrollArea className="h-auto max-h-[40vh]">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Metric</TableHead>
                                <TableHead className="text-right">Result</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {results.productionCalculations.map(([key, value]) => (
                                <TableRow key={key}>
                                    <TableCell className="font-medium">{key}</TableCell>
                                    <TableCell className="text-right">{value}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </ScrollArea>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="summary" className="glassmorphic border rounded-lg">
                    <AccordionTrigger className="p-4 hover:no-underline">
                         <h3 className="text-lg font-semibold flex items-center gap-2"><ShoppingBasket /> Ingredient Summary</h3>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 pt-0">
                        <ScrollArea className="h-auto max-h-[40vh]">
                        <Table>
                            <TableHeader>
                            <TableRow>
                                <TableHead>Ingredient</TableHead>
                                <TableHead className="text-right">Total Amount</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {results.ingredientSummary.length > 0 ? (
                                results.ingredientSummary.map(([key, value, unit]) => (
                                <TableRow key={key}>
                                    <TableCell className="font-medium">{capitalize(key)}</TableCell>
                                    <TableCell className="text-right">{value} {unit}</TableCell>
                                </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center h-24 text-muted-foreground italic">
                                        No ingredients for the entered quantities.
                                    </TableCell>
                                </TableRow>
                            )}
                            </TableBody>
                        </Table>
                        </ScrollArea>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
          ) : (
            <div className="text-center text-muted-foreground italic py-8 border-2 border-dashed rounded-lg">
              <p>Click "Calculate" to see the results.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
