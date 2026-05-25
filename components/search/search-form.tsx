"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { MAX_SEARCH_QUERY_LENGTH } from "@/lib/constants";
import { useSearchMeals } from "@/lib/api-hooks";

import { Meal } from "@/types/meal";

type Props = {
  setSearchResults: (results: Meal[] | null) => void;
  setError: (error: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
};

export default function SearchForm(props: Props) {
  const [validationError, setValidationError] = useState<string | null>(null);
  const { searchMeals, loading, error: apiError } = useSearchMeals();

  // Extract the functions to keep dependency stable
  const { setIsLoading, setError } = props;

  // Sync loading state with parent
  useEffect(() => {
    setIsLoading(loading);
  }, [loading, setIsLoading]);

  // Sync API error state with parent
  useEffect(() => {
    if (apiError) {
      setError(apiError);
    }
  }, [apiError, setError]);

  const queryAPI = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = (formData.get("search-query") as string).trim();

    // Validation: Check if empty
    if (!query) {
      setValidationError("Please enter a meal name to search.");
      return;
    }

    // Validation: Check length
    if (query.length > MAX_SEARCH_QUERY_LENGTH) {
      setValidationError(
        `Search query must be ${MAX_SEARCH_QUERY_LENGTH} characters or less.`
      );
      return;
    }

    setValidationError(null);
    props.setError(null);

    const results = await searchMeals(query);
    if (results === null && !loading) {
      // Error case (handled by hook) or no results
      props.setSearchResults(null);
    } else {
      props.setSearchResults(results);
    }
  };

  return (
    <div className="w-full">
      <form
        className="flex w-full items-end gap-4 border-2 bg-white p-6 dark:bg-zinc-900"
        onSubmit={queryAPI}
        onChange={() => setValidationError(null)} // Clear error on typing
      >
        <div className="flex-1 space-y-2">
          <label
            className="text-sm leading-none font-semibold text-zinc-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-zinc-300"
            htmlFor="search-query"
          >
            Search Meals
          </label>
          <Input
            id="search-query"
            name="search-query"
            type="text"
            placeholder="e.g. Beef, Chicken, Pasta..."
            maxLength={MAX_SEARCH_QUERY_LENGTH}
            aria-invalid={!!validationError}
            aria-describedby={validationError ? "search-error" : undefined}
            className={`w-full focus-visible:ring-offset-2 ${validationError ? "border-destructive ring-destructive" : ""}`}
          />
        </div>
        <Button type="submit" className="font-bold focus-visible:ring-offset-2">
          Search
        </Button>
      </form>

      {/* Validation Error Message */}
      {validationError && (
        <p
          id="search-error"
          className="text-destructive mt-2 ml-1 text-sm font-medium"
          role="alert"
        >
          {validationError}
        </p>
      )}
    </div>
  );
}
