
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import ProductionCalculator from "@/components/production-calculator";
import RecipeScaler from "@/components/recipe-scaler";
import RecipeManager from "@/components/recipe-manager";
import ProductManager from '@/components/product-manager';
import Inventory from '@/components/inventory';
import LoginForm from '@/components/login-form';
import { recipes as initialRecipes, type Recipe } from '@/lib/recipes';
import { productIngredientsData, type ProductIngredients } from '@/lib/productIngredients';
import { LogIn, LogOut } from 'lucide-react';

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [products, setProducts] = useState<ProductIngredients>(productIngredientsData);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsLoginDialogOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  }

  return (
    <>
      <div className="flex flex-col items-center min-h-screen p-4 sm:p-6 md:p-8">
        <header className="w-full max-w-7xl flex justify-between items-start mb-8">
          <div className="text-center flex-grow">
            <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-primary" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
              COFFEE TOWN BAKERY
            </h1>
            <p className="text-sm sm:text-base text-primary-foreground/90 italic mt-2" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
              Not What You Want, But Surely What You Need
            </p>
          </div>
          {isLoggedIn ? (
             <Button
                variant="ghost"
                className="text-primary-foreground hover:text-primary-foreground/80 hover:bg-white/10"
                onClick={handleLogout}
              >
                <LogOut />
                <span className="ml-2">Logout</span>
              </Button>
          ) : (
             <Button
                variant="ghost"
                className="text-primary-foreground hover:text-primary-foreground/80 hover:bg-white/10"
                onClick={() => setIsLoginDialogOpen(true)}
              >
                <LogIn />
                <span className="ml-2">Login</span>
              </Button>
          )}
        </header>

        <main className="w-full max-w-7xl">
          <Tabs defaultValue="calculator" className="w-full">
            <div className="flex justify-center">
              <div className="overflow-x-auto pb-2 -mb-2 hide-scrollbar">
                <TabsList className="bg-primary text-primary-foreground">
                  <TabsTrigger value="calculator" className="text-sm sm:text-base px-2 sm:px-3">Production Calculator</TabsTrigger>
                  <TabsTrigger value="recipe" className="text-sm sm:text-base px-2 sm:px-3">Recipe Scaler</TabsTrigger>
                  <TabsTrigger value="manager" className="text-sm sm:text-base px-2 sm:px-3">Recipe Management</TabsTrigger>
                  <TabsTrigger value="product_management" className="text-sm sm:text-base px-2 sm:px-3">Product Management</TabsTrigger>
                  <TabsTrigger value="inventory" className="text-sm sm:text-base px-2 sm:px-3">Inventory</TabsTrigger>
                </TabsList>
              </div>
            </div>
            <TabsContent value="calculator">
              <ProductionCalculator products={products}/>
            </TabsContent>
            <TabsContent value="recipe">
              <RecipeScaler recipes={recipes} />
            </TabsContent>
            <TabsContent value="manager">
              <RecipeManager recipes={recipes} setRecipes={setRecipes} isLoggedIn={isLoggedIn} />
            </TabsContent>
            <TabsContent value="product_management">
              <ProductManager 
                products={products}
                setProducts={setProducts}
                isLoggedIn={isLoggedIn} 
              />
            </TabsContent>
            <TabsContent value="inventory">
              <Inventory products={products} />
            </TabsContent>
          </Tabs>
        </main>

        <footer className="w-full text-center mt-auto pt-8 text-primary-foreground/80">
          <p>
            Created by <a href="https://twitter.com/Agung_styb" target="_blank" rel="noopener noreferrer" className="font-bold underline hover:text-primary-foreground">Agung Setia Budi</a>
          </p>
        </footer>
      </div>
      <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
          </DialogHeader>
          <LoginForm
            onLoginSuccess={handleLoginSuccess}
            onCancel={() => setIsLoginDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
