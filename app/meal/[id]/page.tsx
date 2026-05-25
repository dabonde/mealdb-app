"use client";

import { useEffect, useState, use } from "react";
import { Meal } from "@/types/meal";
import { useSearch } from "@/context/search-context";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MealDetails from "@/components/meal/meal-details";
import { useMealLookup } from "@/lib/api-hooks";
import { LoadingState, ErrorState } from "@/components/ui/state-displays";

import ErrorBoundary from "@/components/ui/error-boundary";

export default function MealPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { searchResults } = useSearch();
  const [meal, setMeal] = useState<Meal | null>(null);
  const { lookupMeal, loading } = useMealLookup();

  useEffect(() => {
    // 1. Try to find the meal in our shared context first
    const existingMeal = searchResults?.find((m) => m.idMeal === id);

    if (existingMeal) {
      setMeal(existingMeal);
    } else {
      // 2. Fetch if not in memory
      lookupMeal(id).then(setMeal);
    }
  }, [id, searchResults, lookupMeal]);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <LoadingState message="Loading recipe..." className="min-h-[60vh]" />
      </main>
    );
  }

  if (!meal) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ErrorState message="Meal not found" className="min-h-[60vh]" />
        <div className="-mt-20 flex justify-center">
          <Button render={<Link href="/" />}>Back to Home</Button>
        </div>
      </main>
    );
  }

  return (
    <ErrorBoundary>
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          className="group mb-8"
          render={<Link href="/" />}
        >
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:-translate-x-1"
              aria-hidden="true"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to Search
          </div>
        </Button>

        <MealDetails meal={meal} />
      </main>
    </ErrorBoundary>
  );
}
