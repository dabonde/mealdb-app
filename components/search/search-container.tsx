"use client";

import { useSearch } from "@/context/search-context";
import SearchForm from "./search-form";
import Card from "@/components/meal/meal-card";
import CardSkeleton from "@/components/meal/meal-skeleton";
import { Meal } from "@/types/meal";
import { useState } from "react";
import { ErrorState, EmptyState } from "@/components/ui/state-displays";
import { VisuallyHidden } from "@/components/ui/visually-hidden";

export default function Search() {
  const { searchResults, setSearchResults } = useSearch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resultsCount = searchResults?.length ?? 0;
  const announcement = isLoading
    ? "Searching for meals..."
    : searchResults !== null
      ? `Found ${resultsCount} ${resultsCount === 1 ? "meal" : "meals"}.`
      : "";

  return (
    <div className="w-full">
      <VisuallyHidden role="status" aria-live="polite">
        {announcement}
      </VisuallyHidden>

      <SearchForm
        setSearchResults={setSearchResults}
        setError={setError}
        setIsLoading={setIsLoading}
      />

      {error && <ErrorState message={error} className="mt-8" />}

      {isLoading ? (
        <section
          className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          aria-label="Loading Results"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </section>
      ) : (
        <>
          {searchResults === null && (
            <EmptyState
              message="Search for a meal to see results"
              className="py-20"
            />
          )}

          {searchResults !== null && searchResults.length === 0 && (
            <EmptyState
              message="No meals found. Try another search!"
              className="py-20"
            />
          )}

          {searchResults !== null && searchResults.length > 0 && (
            <section
              className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              aria-label="Search Results"
            >
              {searchResults.map((meal: Meal) => (
                <Card key={meal.idMeal} data={meal} />
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
}
