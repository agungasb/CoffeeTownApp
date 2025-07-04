
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ProductionCalculator from "@/components/production-calculator";
import RecipeScaler from "@/components/recipe-scaler";
import RecipeManager from "@/components/recipe-manager";
import ProductManager from '@/components/product-manager';
import InventoryManager from '@/components/inventory-manager';
import DailyUsageDashboard from '@/components/daily-usage-dashboard';
import LoginForm from '@/components/login-form';
import { type Recipe } from '@/lib/recipes';
import { type AllProductsData } from '@/lib/productIngredients';
import { type InventoryItem } from '@/lib/inventoryData';
import type { IngredientFormData } from '@/components/ingredient-form';
import { productDepartments } from '@/lib/products';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  LogIn, 
  LogOut, 
  Calculator, 
  Scaling, 
  BookHeart, 
  Archive, 
  Warehouse,
  Settings,
  History,
  Building
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Label } from './ui/label';
import { Slider } from './ui/slider';

export type DailyUsageIngredient = {
  name: string;
  amount: number;
  unit: string;
};

export type Department = 'rotiManis' | 'donut' | 'rotiSobek' | 'bolu';

export type DailyUsageRecord = {
  id: string;
  date: Date;
  usage: DailyUsageIngredient[];
  department?: Department;
};

interface BakeryAppProps {
    initialRecipes: Recipe[];
    initialProducts: AllProductsData;
    initialInventory: InventoryItem[];
    initialDailyUsage: DailyUsageRecord[];
    actions: {
        addRecipe: (recipe: Omit<Recipe, 'id'>) => Promise<void>;
        updateRecipe: (recipe: Recipe) => Promise<void>;
        deleteRecipe: (recipeId: string) => Promise<void>;
        updateProducts: (products: AllProductsData) => Promise<void>;
        addInventoryItem: (item: Omit<InventoryItem, 'id'>) => Promise<void>;
        updateInventoryItem: (item: InventoryItem) => Promise<void>;
        deleteInventoryItem: (itemId: string) => Promise<void>;
        addDailyUsageRecord: (record: { usage: DailyUsageIngredient[], department: Department }) => Promise<void>;
        resetDailyUsage: () => Promise<void>;
    };
}


export default function BakeryApp({
    initialRecipes,
    initialProducts,
    initialInventory,
    initialDailyUsage,
    actions
}: BakeryAppProps) {
  const { toast } = useToast();
  const router = useRouter();

  const TABS = [
    { id: 'calculator', label: 'Production Calculator', icon: <Calculator /> },
    { id: 'recipe', label: 'Recipe Scaler', icon: <Scaling /> },
    { id: 'manager', label: 'Recipe Management', icon: <BookHeart /> },
    { id: 'product_management', label: 'Product Management', icon: <Archive /> },
    { id: 'inventory', label: 'Inventory Management', icon: <Warehouse /> },
    { id: 'daily_usage', label: 'Usage History', icon: <History /> },
  ];

  const [recipes, setRecipes] = useState(initialRecipes);
  const [products, setProducts] = useState(initialProducts);
  const [inventory, setInventory] = useState(initialInventory);
  const [dailyUsage, setDailyUsage] = useState(initialDailyUsage);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [blur, setBlur] = useState(16);
  const [opacity, setOpacity] = useState(40);
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [activeDepartment, setActiveDepartment] = useState<Department>('rotiManis');

  // This ensures that when router.refresh() provides new initial data,
  // the client-side state is updated to match. This is crucial for keeping
  // data consistent after server actions.
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  useEffect(() => {
    setInventory(initialInventory);
  }, [initialInventory]);
  
  useEffect(() => {
    setRecipes(initialRecipes);
  }, [initialRecipes]);

  useEffect(() => {
    setDailyUsage(initialDailyUsage);
  }, [initialDailyUsage]);


  const departmentProducts = useMemo(() => {
    return productDepartments[activeDepartment];
  }, [activeDepartment]);

  const filteredProducts = useMemo(() => {
    const departmentProductSet = new Set(departmentProducts);
    return Object.entries(products)
      .filter(([name]) => departmentProductSet.has(name))
      .reduce((acc, [name, productData]) => {
        acc[name] = productData;
        return acc;
      }, {} as AllProductsData);
  }, [products, departmentProducts]);

  const filteredInventory = useMemo(() => {
    return inventory.filter(item => item.department === activeDepartment);
  }, [inventory, activeDepartment]);

  const filteredDailyUsage = useMemo(() => {
    return dailyUsage.filter(record => record.department === activeDepartment);
  }, [dailyUsage, activeDepartment]);


  useEffect(() => {
    document.documentElement.style.setProperty('--glass-blur', `${blur}px`);
    document.documentElement.style.setProperty('--glass-opacity', `${opacity / 100}`);
  }, [blur, opacity]);

  useEffect(() => {
    const userIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (userIsLoggedIn) {
      setIsLoggedIn(true);
    }
  }, []);


  const handleLoginSuccess = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
    setIsLoginDialogOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  }

    const addRecipeHandler = async (recipe: Omit<Recipe, 'id'>) => {
        await actions.addRecipe(recipe);
        toast({ title: 'Success', description: 'Recipe added successfully.' });
        router.refresh(); 
    };

    const updateRecipeHandler = async (recipe: Recipe) => {
        await actions.updateRecipe(recipe);
        toast({ title: 'Success', description: 'Recipe updated successfully.' });
        router.refresh(); 
    };

    const deleteRecipeHandler = async (recipeId: string) => {
        await actions.deleteRecipe(recipeId);
        toast({ title: 'Success', description: 'Recipe deleted.' });
        router.refresh(); 
    };
    
    const updateProductsHandler = async (newProducts: AllProductsData) => {
        const fullProductData = { ...products, ...newProducts };
        await actions.updateProducts(fullProductData);
        toast({ title: 'Success', description: 'Product list updated.' });
        router.refresh();
    };
    
    const addInventoryItemHandler = async (itemData: Omit<InventoryItem, 'id'>) => {
        await actions.addInventoryItem(itemData);
        toast({ title: 'Success', description: 'Ingredient added.' });
        router.refresh(); 
    };

    const updateInventoryItemHandler = async (item: InventoryItem) => {
        await actions.updateInventoryItem(item);
        toast({ title: 'Success', description: 'Ingredient updated.' });
        router.refresh();
    };

    const deleteInventoryItemHandler = async (itemId: string) => {
        await actions.deleteInventoryItem(itemId);
        toast({ title: 'Success', description: 'Ingredient deleted.' });
        router.refresh();
    };
    
    const addDailyUsageRecordHandler = async (record: { usage: DailyUsageIngredient[] }) => {
        await actions.addDailyUsageRecord({ ...record, department: activeDepartment });
        toast({ title: 'Success', description: 'Daily usage saved.' });
        router.refresh(); 
    };

    const resetDailyUsageHandler = async () => {
        await actions.resetDailyUsage();
        toast({ title: 'Success', description: 'All historical usage data has been deleted.' });
        router.refresh();
    };

  return (
    <>
      <div className="flex flex-col items-center min-h-screen pb-8">
        
        <header className="fixed top-0 left-0 w-full p-2 md:p-4 z-20 glassmorphic flex justify-between items-center">
            <div>
                 <h1 className="font-headline text-2xl md:text-3xl text-foreground" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                    Coffee Town Bakery
                </h1>
                <p className="hidden md:block text-sm text-foreground/90 italic" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                    Not What You Want, But Surely What You Need
                </p>
            </div>
             <div className="flex items-center gap-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-foreground hover:text-foreground/80 hover:bg-foreground/10" title="Adjust visual settings">
                            <Settings className="h-5 w-5 md:h-6 md:w-6" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 glassmorphic">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <h4 className="font-medium leading-none">Visual Settings</h4>
                                <p className="text-sm text-muted-foreground">
                                    Adjust the glass effect for all panels.
                                </p>
                            </div>
                            <div className="grid gap-4">
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <Label htmlFor="blur" className="text-sm">Blur</Label>
                                    <Slider
                                        id="blur"
                                        value={[blur]}
                                        max={100}
                                        step={1}
                                        onValueChange={(value) => setBlur(value[0])}
                                        className="col-span-2"
                                    />
                                </div>
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <Label htmlFor="opacity" className="text-sm">Opacity</Label>
                                    <Slider
                                        id="opacity"
                                        value={[opacity]}
                                        max={100}
                                        step={1}
                                        onValueChange={(value) => setOpacity(value[0])}
                                        className="col-span-2"
                                    />
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
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

        <div className="fixed top-[61px] md:top-[74px] left-0 w-full z-10 py-2 glassmorphic flex flex-col items-center justify-center gap-2">
            <div className="overflow-x-auto hide-scrollbar w-full">
                <div className="flex justify-center items-center gap-5 px-4">
                  {TABS.map((tab) => (
                     <button 
                        key={tab.id}
                        className={`nav-button ${activeTab === tab.id ? 'active' : ''}`} 
                        onClick={() => setActiveTab(tab.id)}
                      >
                        {tab.icon}
                        <span className="hidden sm:inline">{tab.label}</span>
                      </button>
                  ))}
                </div>
            </div>
             <div className="flex items-center gap-2 px-4">
                <Building className="h-5 w-5 text-foreground" />
                <Label htmlFor="department" className="text-foreground font-semibold">Department:</Label>
                <Select onValueChange={(value: Department) => setActiveDepartment(value)} value={activeDepartment}>
                    <SelectTrigger id="department" className="w-[200px] bg-background/80">
                        <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="rotiManis">Department Roti Manis</SelectItem>
                        <SelectItem value="donut">Department Donut</SelectItem>
                        <SelectItem value="rotiSobek">Department Roti Sobek</SelectItem>
                        <SelectItem value="bolu">Department Bolu</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>


        <main className="w-full max-w-7xl mt-[160px] md:mt-[170px] p-4 sm:p-6 md:p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="calculator">
              <ProductionCalculator 
                key={activeDepartment}
                products={products}
                productList={departmentProducts}
                recipes={recipes}
                inventory={inventory}
                addDailyUsageRecord={addDailyUsageRecordHandler} 
                isLoggedIn={isLoggedIn}
                department={activeDepartment}
              />
            </TabsContent>
            <TabsContent value="recipe">
              <RecipeScaler recipes={recipes} />
            </TabsContent>
            <TabsContent value="manager">
              <RecipeManager 
                recipes={recipes} 
                addRecipe={addRecipeHandler}
                updateRecipe={updateRecipeHandler}
                deleteRecipe={deleteRecipeHandler}
                isLoggedIn={isLoggedIn} 
              />
            </TabsContent>
            <TabsContent value="product_management">
              <ProductManager 
                products={products}
                department={activeDepartment}
                recipes={recipes}
                updateProducts={updateProductsHandler}
                isLoggedIn={isLoggedIn} 
              />
            </TabsContent>
             <TabsContent value="inventory">
                <InventoryManager 
                    inventory={filteredInventory}
                    addInventoryItem={addInventoryItemHandler}
                    updateInventoryItem={updateInventoryItemHandler}
                    deleteInventoryItem={deleteInventoryItemHandler}
                    dailyUsageRecords={filteredDailyUsage}
                    resetDailyUsage={resetDailyUsageHandler}
                    isLoggedIn={isLoggedIn}
                    department={activeDepartment}
                />
            </TabsContent>
            <TabsContent value="daily_usage">
              <DailyUsageDashboard dailyUsageRecords={filteredDailyUsage} />
            </TabsContent>
          </Tabs>
        </main>
        
        <footer className="fixed bottom-0 left-0 w-full py-2 text-center glassmorphic border-t border-foreground/30 text-foreground font-medium text-xs">
            <div className="flex justify-center items-center gap-2">
                <span>Created for BAKER Coffee Town</span>
                <span className="mx-1">|</span>
                <a href="https://x.com/Agung_styb" target="_blank" rel="noopener noreferrer" className="hover:underline">
                    Follow me @Agung_styb
                </a>
            </div>
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

    
