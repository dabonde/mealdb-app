"use client";

import { useState } from "react";
import { Meal } from "@/types/meal";
import { useShopping } from "@/context/shopping-context";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";
import { getMealIngredients } from "@/lib/shopping-utils";
import { Badge } from "@/components/ui/badge";
import { AppIcon } from "@/components/ui/app-icon";
import { VisuallyHidden } from "@/components/ui/visually-hidden";

interface MealDetailsProps {
  meal: Meal;
}

export default function MealDetails({ meal }: MealDetailsProps) {
  const { addMealToShoppingList } = useShopping();
  const [added, setAdded] = useState(false);
  const ingredients = getMealIngredients(meal);

  const handleAddToList = () => {
    addMealToShoppingList(meal);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-10">
      <VisuallyHidden role="status" aria-live="polite">
        {added
          ? `${meal.strMeal} ingredients added to your shopping list.`
          : ""}
      </VisuallyHidden>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden border-2 border-zinc-200 dark:border-zinc-800">
          <img
            src={meal.strMealThumb}
            alt={meal.strMeal}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <div className="mb-4 flex gap-2">
            <Badge variant="orange">{meal.strCategory}</Badge>
            <Badge variant="blue">{meal.strArea}</Badge>
          </div>
          <h1 className="mb-6 text-4xl leading-tight font-extrabold text-zinc-900 dark:text-zinc-100">
            {meal.strMeal}
          </h1>

          <Button
            onClick={handleAddToList}
            size="lg"
            className={`mb-8 w-full gap-3 font-bold transition-all sm:w-auto ${
              added ? "bg-green-600 hover:bg-green-700" : ""
            }`}
          >
            {added ? (
              <Check className="h-5 w-5" />
            ) : (
              <ShoppingCart className="h-5 w-5" />
            )}
            {added ? "Added to List!" : "Add to my shopping list"}
          </Button>

          <aside
            className="border-2 border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950"
            aria-labelledby="quick-info-title"
          >
            <h3
              id="quick-info-title"
              className="text-primary mb-4 flex items-center gap-2 text-lg font-bold"
            >
              <AppIcon name="utensils" size={20} />
              Quick Info
            </h3>
            <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
              <li className="flex justify-between">
                <span>Category:</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {meal.strCategory}
                </span>
              </li>
              <li className="flex justify-between">
                <span>Cuisine:</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {meal.strArea}
                </span>
              </li>
              {meal.strTags && (
                <li className="flex justify-between">
                  <span>Tags:</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {meal.strTags}
                  </span>
                </li>
              )}
            </ul>
          </aside>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12 border-t pt-10 lg:grid-cols-3">
        <section className="lg:col-span-2" aria-labelledby="instructions-title">
          <h2
            id="instructions-title"
            className="mb-6 flex items-center gap-2 text-2xl font-bold"
          >
            Instructions
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
              {meal.strInstructions}
            </p>
          </div>
        </section>

        <section aria-labelledby="ingredients-title">
          <h2
            id="ingredients-title"
            className="mb-6 flex items-center gap-2 text-2xl font-bold"
          >
            Ingredients
          </h2>
          <ul className="space-y-3">
            {ingredients.map((item, i) => (
              <li
                key={i}
                className="flex justify-between border-2 border-zinc-100 bg-zinc-50 p-3 text-sm dark:border-zinc-800 dark:bg-zinc-950"
              >
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {item.name}
                </span>
                <span className="text-zinc-500">{item.measure}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
