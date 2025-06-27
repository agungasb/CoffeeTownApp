
"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, doc, getDocs, getDoc, setDoc, addDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ProductionCalculator from "@/components/production-calculator";
import RecipeScaler from "@/components/recipe-scaler";
import RecipeManager from "@/components/recipe-manager";
import ProductManager from '@/components/product-manager';
import InventoryManager from '@/components/inventory-manager';
import LoginForm from '@/components/login-form';
import { recipes as initialRecipes, type Recipe } from '@/lib/recipes';
import { productIngredientsData as initialProductData, type ProductIngredients } from '@/lib/productIngredients';
import { inventoryData as initialInventory, type InventoryItem } from '@/lib/inventoryData';
import type { IngredientFormData } from '@/components/ingredient-form';
import { useToast } from '@/hooks/use-toast';
import { 
  LogIn, 
  LogOut, 
  Calculator, 
  Scaling, 
  BookHeart, 
  Archive, 
  Warehouse,
  Loader2
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export type DailyUsageRecord = {
  id: string;
  date: Date;
  usage: [string, number, string][];
};

const TABS = [
  { id: 'calculator', label: 'Production Calculator', icon: <Calculator /> },
  { id: 'recipe', label: 'Recipe Scaler', icon: <Scaling /> },
  { id: 'manager', label: 'Recipe Management', icon: <BookHeart /> },
  { id: 'product_management', label: 'Product Management', icon: <Archive /> },
  { id: 'inventory', label: 'Inventory Management', icon: <Warehouse /> },
];

export default function Home() {
  const { toast } = useToast();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [products, setProducts] = useState<ProductIngredients>({});
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [dailyUsage, setDailyUsage] = useState<DailyUsageRecord[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('calculator');

  useEffect(() => {
    const fetchData = async () => {
      const requiredEnvVars = [
        'NEXT_PUBLIC_FIREBASE_API_KEY',
        'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
        'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
        'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
        'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
        'NEXT_PUBLIC_FIREBASE_APP_ID',
      ];
      const missingVars = requiredEnvVars.filter(key => !process.env[key]);

      if (missingVars.length > 0) {
        toast({
            variant: 'destructive',
            title: 'Firebase Not Configured',
            description: `The following environment variables are missing in your .env file: ${missingVars.join(', ')}. Please get them from your Firebase project settings.`,
            duration: 15000,
        });
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // --- Recipes ---
        const recipesCol = collection(db, 'recipes');
        const recipeSnapshot = await getDocs(recipesCol);
        if (recipeSnapshot.empty) {
          const batch = writeBatch(db);
          initialRecipes.forEach(recipe => {
            const docRef = doc(db, 'recipes', recipe.id);
            batch.set(docRef, recipe);
          });
          await batch.commit();
          setRecipes(initialRecipes);
        } else {
          const recipesList = recipeSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Recipe));
          setRecipes(recipesList);
        }

        // --- Products ---
        const productsDocRef = doc(db, 'products', 'allProducts');
        const productsSnapshot = await getDoc(productsDocRef);
        if (!productsSnapshot.exists()) {
            await setDoc(productsDocRef, { data: initialProductData });
            setProducts(initialProductData);
        } else {
            setProducts(productsSnapshot.data().data as ProductIngredients);
        }

        // --- Inventory ---
        const inventoryCol = collection(db, 'inventory');
        const inventorySnapshot = await getDocs(inventoryCol);
        if (inventorySnapshot.empty) {
            const batch = writeBatch(db);
            initialInventory.forEach(item => {
                const docRef = doc(db, 'inventory', item.id);
                batch.set(docRef, item);
            });
            await batch.commit();
            setInventory(initialInventory);
        } else {
            const inventoryList = inventorySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as InventoryItem));
            setInventory(inventoryList);
        }

        // --- Daily Usage ---
        const usageCol = collection(db, 'dailyUsage');
        const usageSnapshot = await getDocs(usageCol);
        const usageList = usageSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                date: data.date.toDate(),
                usage: data.usage
            } as DailyUsageRecord;
        });
        setDailyUsage(usageList.sort((a,b) => b.date.getTime() - a.date.getTime()));

      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
        toast({
            variant: 'destructive',
            title: 'Error Loading Data',
            description: 'Could not connect to the database. Check console for details.'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsLoginDialogOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  }

  // --- CRUD Handlers ---

  const addRecipe = async (recipe: Omit<Recipe, 'id'>) => {
      const newId = recipe.name.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now();
      const newRecipe = { ...recipe, id: newId };
      await setDoc(doc(db, 'recipes', newId), recipe);
      setRecipes(prev => [...prev, newRecipe]);
  };

  const updateRecipe = async (recipe: Recipe) => {
      await setDoc(doc(db, 'recipes', recipe.id), recipe);
      setRecipes(prev => prev.map(r => r.id === recipe.id ? recipe : r));
  };

  const deleteRecipe = async (recipeId: string) => {
      await deleteDoc(doc(db, 'recipes', recipeId));
      setRecipes(prev => prev.filter(r => r.id !== recipeId));
  };
  
  const updateProducts = async (newProducts: ProductIngredients) => {
      await setDoc(doc(db, 'products', 'allProducts'), { data: newProducts });
      setProducts(newProducts);
  };
  
  const addInventoryItem = async (itemData: IngredientFormData) => {
      const docRef = await addDoc(collection(db, 'inventory'), itemData);
      const newItem = { ...itemData, id: docRef.id } as InventoryItem;
      setInventory(prev => [...prev, newItem]);
  };

  const updateInventoryItem = async (item: InventoryItem) => {
      const docRef = doc(db, 'inventory', item.id);
      await setDoc(docRef, item);
      setInventory(prev => prev.map(i => i.id === item.id ? item : i));
  };

  const deleteInventoryItem = async (itemId: string) => {
      await deleteDoc(doc(db, 'inventory', itemId));
      setInventory(prev => prev.filter(i => i.id !== itemId));
  };
  
  const addDailyUsageRecord = async (record: Omit<DailyUsageRecord, 'id'>) => {
      const docRef = await addDoc(collection(db, 'dailyUsage'), record);
      const newRecord = { ...record, id: docRef.id };
      setDailyUsage(prev => [newRecord, ...prev]);
  };

  if (loading) {
      return (
          <div className="flex justify-center items-center min-h-screen flex-col gap-4 bg-background">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <p className="text-xl text-foreground">Loading Bakery Data...</p>
          </div>
      )
  }

  return (
    <>
      <div className="flex flex-col items-center min-h-screen pb-20">
        
        <header className="fixed top-0 left-0 w-full p-2 md:p-4 z-20 glassmorphic flex justify-between items-center">
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

        <nav className="fixed top-[74px] md:top-[96px] left-0 w-full z-10 py-2 glassmorphic flex items-center justify-center">
            <div className="overflow-x-auto hide-scrollbar">
                <div className="flex justify-start md:justify-center items-center gap-5 px-4">
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
        </nav>


        <main className="w-full max-w-7xl mt-[136px] md:mt-[160px] p-4 sm:p-6 md:p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="calculator">
              <ProductionCalculator products={products} addDailyUsageRecord={addDailyUsageRecord}/>
            </TabsContent>
            <TabsContent value="recipe">
              <RecipeScaler recipes={recipes} />
            </TabsContent>
            <TabsContent value="manager">
              <RecipeManager 
                recipes={recipes} 
                addRecipe={addRecipe}
                updateRecipe={updateRecipe}
                deleteRecipe={deleteRecipe}
                isLoggedIn={isLoggedIn} 
              />
            </TabsContent>
            <TabsContent value="product_management">
              <ProductManager 
                products={products}
                updateProducts={updateProducts}
                isLoggedIn={isLoggedIn} 
              />
            </TabsContent>
             <TabsContent value="inventory">
                <InventoryManager 
                    inventory={inventory}
                    addInventoryItem={addInventoryItem}
                    updateInventoryItem={updateInventoryItem}
                    deleteInventoryItem={deleteInventoryItem}
                    dailyUsageRecords={dailyUsage}
                    isLoggedIn={isLoggedIn}
                />
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
