
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
import { inventoryData as initialInventory, type InventoryItem } from '@/lib/inventoryData';
import { 
  LogIn, 
  LogOut, 
  Calculator, 
  Scaling, 
  BookHeart, 
  Archive, 
  Warehouse 
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

const TABS = [
  { id: 'calculator', label: 'Production Calculator', icon: <Calculator /> },
  { id: 'recipe', label: 'Recipe Scaler', icon: <Scaling /> },
  { id: 'manager', label: 'Recipe Management', icon: <BookHeart /> },
  { id: 'product_management', label: 'Product Management', icon: <Archive /> },
  { id: 'inventory', label: 'Inventory', icon: <Warehouse /> },
];

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [products, setProducts] = useState<ProductIngredients>(productIngredientsData);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
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
      <div className="flex flex-col items-center min-h-screen pb-20">
        
        <header className="fixed top-0 left-0 w-full p-4 z-20 glassmorphic flex justify-between items-center">
            <div>
                 <h1 className="font-headline text-2xl md:text-3xl text-primary-foreground" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                    Coffee Town Bakery
                </h1>
                <p className="hidden md:block text-sm text-foreground/90 italic" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                    Not What You Want, But Surely What You Need
                </p>
            </div>
             <div className="flex items-center gap-2">
                <ThemeToggle />
                {isLoggedIn ? (
                    <Button
                        variant="ghost"
                        className="text-foreground hover:text-foreground/80 hover:bg-foreground/10"
                        onClick={handleLogout}
                        title="Logout"
                    >
                        <LogOut className="h-5 w-5 md:h-6 md:w-6" />
                    </Button>
                ) : (
                    <Button
                        variant="ghost"
                        className="text-foreground hover:text-foreground/80 hover:bg-foreground/10"
                        onClick={() => setIsLoginDialogOpen(true)}
                        title="Login"
                    >
                        <LogIn className="h-5 w-5 md:h-6 md:w-6" />
                    </Button>
                )}
            </div>
        </header>

        <nav className="fixed top-[88px] md:top-[96px] left-0 w-full z-10 py-2 glassmorphic flex items-center justify-center">
            <div className="overflow-x-auto hide-scrollbar">
                <div className="flex justify-start md:justify-center items-center gap-5 px-4">
                  {TABS.map((tab) => (
                     <button 
                        key={tab.id}
                        className={`nav-button ${activeTab === tab.id ? 'active' : ''}`} 
                        onClick={() => setActiveTab(tab.id)}
                      >
                        {tab.icon}
                        <span>{tab.label}</span>
                      </button>
                  ))}
                </div>
            </div>
        </nav>


        <main className="w-full max-w-7xl mt-[160px] p-4 sm:p-6 md:p-8">
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
              <Inventory inventory={inventory} setInventory={setInventory} isLoggedIn={isLoggedIn} />
            </TabsContent>
          </Tabs>
        </main>
        
        <footer className="fixed bottom-0 left-0 w-full p-4 text-center glassmorphic border-t border-foreground/30 text-primary-foreground font-medium text-sm">
            © 2024 Coffee Town Bakery. All Rights Reserved. | Follow me <a href="https://twitter.com/Agung_styb" target="_blank" rel="noopener noreferrer" className="font-bold underline text-accent-foreground/80 hover:text-accent-foreground">@Agung_styb</a>
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
