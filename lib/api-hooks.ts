"use client";

import { useState, useCallback } from "react";
import { Meal, MealResponse } from "@/types/meal";
import { API_ENDPOINTS } from "./constants";

/**
 * Hook for fetching a random meal.
 */
export function useRandomMeal() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRandomMeal = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.RANDOM);

      if (!response.ok) {
        if (response.status >= 500) {
          throw new Error("Server error. Please try again later.");
        }
        throw new Error(`Request failed with status: ${response.status}`);
      }

      const data: MealResponse = await response.json();
      return data.meals?.[0] || null;
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchRandomMeal, loading, error };
}

/**
 * Hook for searching meals by name.
 */
export function useSearchMeals() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchMeals = useCallback(async (query: string) => {
    if (!query.trim()) return null;

    setLoading(true);
    setError(null);
    try {
      const url = new URL(API_ENDPOINTS.SEARCH);
      url.searchParams.set("s", query);

      const response = await fetch(url.toString());

      if (!response.ok) {
        if (response.status >= 500) {
          throw new Error("Search service is currently unavailable.");
        }
        throw new Error(`Search failed with status: ${response.status}`);
      }

      const data: MealResponse = await response.json();
      // The API returns { meals: null } when no results are found.
      // We normalize this to an empty array [] so the UI can distinguish
      // between "never searched" (null) and "no results found" ([]).
      return data.meals || [];
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { searchMeals, loading, error };
}

/**
 * Hook for looking up a specific meal by ID.
 */
export function useMealLookup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookupMeal = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL(API_ENDPOINTS.LOOKUP);
      url.searchParams.set("i", id);

      const response = await fetch(url.toString());

      if (!response.ok) {
        if (response.status >= 500) {
          throw new Error("Recipe lookup service is temporarily unavailable.");
        }
        throw new Error(`Lookup failed with status: ${response.status}`);
      }

      const data: MealResponse = await response.json();
      return data.meals?.[0] || null;
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { lookupMeal, loading, error };
}
