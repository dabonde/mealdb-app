"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { Meal } from "@/types/meal";
import { ShoppingItem, mergeMealIntoList } from "@/lib/shopping-utils";
import { useLocalStorage } from "@/lib/use-local-storage";

interface ShoppingContextType {
  shoppingList: ShoppingItem[];
  addMealToShoppingList: (meal: Meal) => void;
  clearShoppingList: () => void;
  removeItem: (name: string) => void;
}

const ShoppingContext = createContext<ShoppingContextType | undefined>(
  undefined
);

export function ShoppingProvider({ children }: { children: ReactNode }) {
  const [shoppingList, setShoppingList] = useLocalStorage<ShoppingItem[]>(
    "mealdb_shopping_list",
    []
  );

  const addMealToShoppingList = (meal: Meal) => {
    setShoppingList((prevList) => mergeMealIntoList(prevList, meal));
  };

  const clearShoppingList = () => setShoppingList([]);

  const removeItem = (name: string) => {
    setShoppingList((prev) => prev.filter((item) => item.name !== name));
  };

  return (
    <ShoppingContext.Provider
      value={{
        shoppingList,
        addMealToShoppingList,
        clearShoppingList,
        removeItem,
      }}
    >
      {children}
    </ShoppingContext.Provider>
  );
}

export function useShopping() {
  const context = useContext(ShoppingContext);
  if (context === undefined) {
    throw new Error("useShopping must be used within a ShoppingProvider");
  }
  return context;
}
