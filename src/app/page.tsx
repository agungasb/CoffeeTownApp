"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductionCalculator from "@/components/production-calculator";
import RecipeScaler from "@/components/recipe-scaler";
import RecipeManager from "@/components/recipe-manager";
import { recipes as initialRecipes, type Recipe } from '@/lib/recipes';

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);

  return (
    <div className="flex flex-col items-center min-h-screen p-4 md:p-8">
      <header className="text-center mb-8">
        <h1 className="font-headline text-5xl md:text-6xl font-bold text-primary-foreground" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
          BakeWise
        </h1>
        <p className="text-primary-foreground/90 italic mt-2" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
          Not What You Want, But Surely What You Need
        </p>
      </header>

      <main className="w-full max-w-7xl">
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-lg mx-auto h-12">
            <TabsTrigger value="calculator" className="text-lg h-10">Production Calculator</TabsTrigger>
            <TabsTrigger value="recipe" className="text-lg h-10">Recipe Scaler</TabsTrigger>
            <TabsTrigger value="manager" className="text-lg h-10">Recipe Management</TabsTrigger>
          </TabsList>
          <TabsContent value="calculator">
            <ProductionCalculator />
          </TabsContent>
          <TabsContent value="recipe">
            <RecipeScaler recipes={recipes} />
          </TabsContent>
          <TabsContent value="manager">
            <RecipeManager recipes={recipes} setRecipes={setRecipes} />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="w-full text-center mt-auto pt-8 text-primary-foreground/80">
        <p>
          Created by <a href="https://twitter.com/Agung_styb" target="_blank" rel="noopener noreferrer" className="font-bold underline hover:text-primary-foreground">Agung Setia Budi</a>
        </p>
      </footer>
    </div>
  );
}
