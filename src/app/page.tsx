
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ProductionCalculator from "@/components/production-calculator";
import RecipeScaler from "@/components/recipe-scaler";
import RecipeManager from "@/components/recipe-manager";
import ProductManager from '@/components/product-manager';
import Inventory from '@/components/inventory';
import LoginForm from '@/components/login-form';
import { recipes as initialRecipes, type Recipe } from '@/lib/recipes';
import { productIngredientsData, type ProductIngredients } from '@/lib/productIngredients';
import { LogIn, LogOut } from 'lucide-react';

const TABS = [
  { id: 'calculator', label: 'Production Calculator' },
  { id: 'recipe', label: 'Recipe Scaler' },
  { id: 'manager', label: 'Recipe Management' },
  { id: 'product_management', label: 'Product Management' },
  { id: 'inventory', label: 'Inventory' },
];

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [products, setProducts] = useState<ProductIngredients>(productIngredientsData);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('calculator');

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsLoginDialogOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  }

  return (
    <>
      <div className="flex flex-col items-center min-h-screen p-4 sm:p-6 md:p-8 pb-20">
        <header className="fixed top-0 right-0 p-4 md:p-8 z-20 text-right">
          <h1 className="font-headline text-3xl text-[#f9e1c0]" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            Coffee Town Bakery
          </h1>
          <p className="text-sm text-white/90 italic" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
            Not What You Want, But Surely What You Need
          </p>
        </header>
        
        <nav className="fixed top-[80px] left-0 w-full z-10 py-2 glassmorphic flex items-center">
            <div className="overflow-x-auto hide-scrollbar">
                <div className="flex justify-start md:justify-center gap-5 px-4">
                  {TABS.map((tab) => (
                     <button 
                        key={tab.id}
                        className={`nav-button ${activeTab === tab.id ? 'active' : ''}`} 
                        onClick={() => setActiveTab(tab.id)}
                      >
                        {tab.label}
                      </button>
                  ))}
                </div>
            </div>
        </nav>


        <main className="w-full max-w-7xl mt-[140px]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
        
        {isLoggedIn ? (
             <Button
                variant="ghost"
                className="fixed top-4 left-4 z-20 text-white hover:text-white/80 hover:bg-white/10"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut />
              </Button>
          ) : (
             <Button
                variant="ghost"
                className="fixed top-4 left-4 z-20 text-white hover:text-white/80 hover:bg-white/10"
                onClick={() => setIsLoginDialogOpen(true)}
                title="Login"
              >
                <LogIn />
              </Button>
          )}

        <footer className="fixed bottom-0 left-0 w-full p-4 text-center glassmorphic border-t border-white/30 text-[#f9e1c0] font-medium text-sm">
            Created by <a href="https://twitter.com/Agung_styb" target="_blank" rel="noopener noreferrer" className="font-bold underline text-[#ffdd99] hover:text-[#ffbb66]">Agung Setia Budi</a>
        </footer>
      </div>
      <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <DialogContent className="sm:max-w-md glassmorphic">
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
