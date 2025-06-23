"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import ProductionCalculator from "@/components/production-calculator";
import RecipeScaler from "@/components/recipe-scaler";
import RecipeManager from "@/components/recipe-manager";
import LoginForm from '@/components/login-form';
import { recipes as initialRecipes, type Recipe } from '@/lib/recipes';
import { LogIn, LogOut } from 'lucide-react';

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
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
            <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-secondary-foreground" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
              COFFEE TOWN BAKERY
            </h1>
            <p className="text-sm sm:text-base text-secondary-foreground/90 italic mt-2" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
              Not What You Want, But Surely What You Need
            </p>
          </div>
          {isLoggedIn ? (
             <Button
                variant="ghost"
                className="text-secondary-foreground hover:text-secondary-foreground/80 hover:bg-white/10"
                onClick={handleLogout}
              >
                <LogOut />
                <span className="ml-2">Logout</span>
              </Button>
          ) : (
             <Button
                variant="ghost"
                className="text-secondary-foreground hover:text-secondary-foreground/80 hover:bg-white/10"
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
                <TabsList>
                  <TabsTrigger value="calculator" className="text-sm sm:text-base px-2 sm:px-3">Production Calculator</TabsTrigger>
                  <TabsTrigger value="recipe" className="text-sm sm:text-base px-2 sm:px-3">Recipe Scaler</TabsTrigger>
                  <TabsTrigger value="manager" className="text-sm sm:text-base px-2 sm:px-3">Recipe Management</TabsTrigger>
                  <TabsTrigger value="new1" className="text-sm sm:text-base px-2 sm:px-3">New Tab One</TabsTrigger>
                  <TabsTrigger value="new2" className="text-sm sm:text-base px-2 sm:px-3">New Tab Two</TabsTrigger>
                  <TabsTrigger value="new3" className="text-sm sm:text-base px-2 sm:px-3">New Tab Three</TabsTrigger>
                  <TabsTrigger value="new4" className="text-sm sm:text-base px-2 sm:px-3">New Tab Four</TabsTrigger>
                </TabsList>
              </div>
            </div>
            <TabsContent value="calculator">
              <ProductionCalculator />
            </TabsContent>
            <TabsContent value="recipe">
              <RecipeScaler recipes={recipes} />
            </TabsContent>
            <TabsContent value="manager">
              <RecipeManager recipes={recipes} setRecipes={setRecipes} isLoggedIn={isLoggedIn} />
            </TabsContent>
            <TabsContent value="new1">
              <Card className="glassmorphic border-2 border-border/30 w-full max-w-6xl mx-auto">
                <CardContent className="pt-6">
                  <p>Content for New Tab One.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="new2">
              <Card className="glassmorphic border-2 border-border/30 w-full max-w-6xl mx-auto">
                <CardContent className="pt-6">
                  <p>Content for New Tab Two.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="new3">
              <Card className="glassmorphic border-2 border-border/30 w-full max-w-6xl mx-auto">
                <CardContent className="pt-6">
                  <p>Content for New Tab Three.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="new4">
              <Card className="glassmorphic border-2 border-border/30 w-full max-w-6xl mx-auto">
                <CardContent className="pt-6">
                  <p>Content for New Tab Four.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>

        <footer className="w-full text-center mt-auto pt-8 text-secondary-foreground/80">
          <p>
            Created by <a href="https://twitter.com/Agung_styb" target="_blank" rel="noopener noreferrer" className="font-bold underline hover:text-secondary-foreground">Agung Setia Budi</a>
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
