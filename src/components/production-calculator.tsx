"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloud, Loader2, Calculator } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { productItems } from "@/lib/products";
import { productionSchema, calculateProductionMetrics, initialCalculations } from "@/lib/calculations";
import type { ProductionInputs } from "@/lib/calculations";
import { getQuantitiesFromImage } from "@/app/actions";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Allow empty strings for form state, which will render as empty inputs
type ProductionFormValues = {
  [K in keyof ProductionInputs]: number | '';
};

export default function ProductionCalculator() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [results, setResults] = useState(initialCalculations);

  const form = useForm<ProductionFormValues>({
    resolver: zodResolver(productionSchema),
    defaultValues: productItems.reduce((acc, item) => ({ ...acc, [item]: '' }), {}),
  });

  const watchedValues = form.watch();

  useEffect(() => {
    // calculateProductionMetrics expects all values to be numbers.
    // The `calculateProductionMetrics` function already handles this by using `Number()`,
    // so we can safely cast the type.
    const newResults = calculateProductionMetrics(watchedValues as ProductionInputs);
    setResults(newResults);
  }, [JSON.stringify(watchedValues)]);


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
            for (const [key, value] of Object.entries(data)) {
              if (productItems.includes(key)) {
                form.setValue(key as keyof ProductionFormValues, value, { shouldValidate: true });
                filledCount++;
              }
            }
            toast({ title: "Success", description: `Auto-filled ${filledCount} items.` });
          }
        });
      }
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  return (
    <Card className="glassmorphic border-2 border-border/30 w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle>Production Quantities</CardTitle>
        <CardDescription>Enter product quantities or upload an image to auto-fill.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="mb-4">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <Button onClick={() => fileInputRef.current?.click()} disabled={isPending} className="w-full">
                {isPending ? <Loader2 className="animate-spin" /> : <UploadCloud />}
                Upload Screenshot for Auto-Fill
              </Button>
            </div>
            <Form {...form}>
              <form>
                <div className="space-y-4">
                  {productItems.map((item) => (
                    <FormField
                      key={item}
                      control={form.control}
                      name={item as keyof ProductionFormValues}
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>{item.split('_').map(capitalize).join(' ')}</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} className="w-24" />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </form>
            </Form>
          </div>

          <div>
            <h3 className="font-headline text-xl md:text-2xl mb-4 text-center flex items-center justify-center gap-2"><Calculator/> Calculation Results</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead className="text-right">Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell className="font-medium">{key}</TableCell>
                    <TableCell className="text-right">{value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
