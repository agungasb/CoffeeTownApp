
"use client";

import { useState, useTransition, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloud, Loader2, Calculator, ShoppingBasket } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { capitalize } from "@/lib/utils";

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

  return (
    <Card className="glassmorphic border-none shadow-lg w-full max-w-[600px] mx-auto">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-6">
          
          <div className="p-4 bg-white/10 rounded-lg">
            <label className="block mb-2 text-center text-[#f9e1c0] font-medium">Upload Screenshot for Auto-Fill</label>
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
              className="w-full bg-[#5a3e2b] text-white hover:bg-[#7a5a42] hover:scale-105 transition-all text-base font-medium"
            >
              {isPending ? <Loader2 className="animate-spin" /> : <UploadCloud />}
              {isPending ? 'Analyzing...' : 'Upload & Map Quantities'}
            </Button>
          </div>

          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCalculate)} className="space-y-4">
                <ScrollArea className="h-[45vh] pr-2">
                  <div className="space-y-2">
                    {productList.map((item) => (
                      <FormField
                        key={item}
                        control={form.control}
                        name={item as any}
                        render={({ field }) => (
                          <FormItem className="flex justify-between items-center py-2 border-b border-white/30">
                              <FormLabel className="flex-grow text-left text-[#f9e1c0] font-medium text-sm">
                                {capitalize(item)}
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  {...field} 
                                  placeholder="0"
                                  className="flex-none w-24 text-center bg-white/80 text-black rounded-md py-1 px-2 h-auto focus:shadow-[0_0_8px_rgba(255,255,255,0.5)] focus:ring-0 focus:outline-none border-none"
                                  onChange={e => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                                  value={field.value === 0 ? '' : field.value}
                                />
                              </FormControl>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </ScrollArea>
                <Button type="submit" className="w-full mt-4 bg-[#5a3e2b] text-white hover:bg-[#7a5a42] hover:scale-105 transition-all text-base font-medium p-6">
                    <Calculator className="mr-2"/>
                    CALCULATE
                </Button>
              </form>
            </Form>
          </div>

          {hasCalculated ? (
            <Accordion type="multiple" defaultValue={['results', 'summary']} className="w-full space-y-4">
                <AccordionItem value="results" className="glassmorphic border-none rounded-lg text-black">
                    <AccordionTrigger className="p-4 hover:no-underline text-white font-semibold text-lg">
                        <h3 className="flex items-center gap-2"><Calculator /> Calculation Results</h3>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 pt-0">
                        <ScrollArea className="h-auto max-h-[40vh]">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-white/30">
                                <TableHead className="text-black font-semibold">Metric</TableHead>
                                <TableHead className="text-right text-black font-semibold">Result</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {results.productionCalculations.map(([key, value]) => (
                                <TableRow key={key} className="border-white/30">
                                    <TableCell className="font-medium text-black">{key}</TableCell>
                                    <TableCell className="text-right text-black">{value}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </ScrollArea>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="summary" className="glassmorphic border-none rounded-lg text-black">
                    <AccordionTrigger className="p-4 hover:no-underline text-white font-semibold text-lg">
                         <h3 className="flex items-center gap-2"><ShoppingBasket /> Ingredient Summary</h3>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 pt-0">
                        <ScrollArea className="h-auto max-h-[40vh]">
                        <Table>
                            <TableHeader>
                            <TableRow className="border-white/30">
                                <TableHead className="text-black font-semibold">Ingredient</TableHead>
                                <TableHead className="text-right text-black font-semibold">Total Amount</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {results.ingredientSummary.length > 0 ? (
                                results.ingredientSummary.map(([key, value, unit]) => (
                                <TableRow key={key} className="border-white/30">
                                    <TableCell className="font-medium text-black">{capitalize(key)}</TableCell>
                                    <TableCell className="text-right text-black">{value} {unit}</TableCell>
                                </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center h-24 text-black italic">
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
            <div className="text-center text-white/80 italic py-8 border-2 border-dashed border-white/30 rounded-lg">
              <p>Click "Calculate" to see the results.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
