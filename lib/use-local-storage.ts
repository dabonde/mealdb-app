"use client";

import { useState, useEffect, useRef } from "react";

/**
 * A custom hook to synchronize state with localStorage.
 * Fixed to prevent accidental wipes during Next.js hydration.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Use a ref to prevent writing to localStorage on the initial mount/render
  const isInitialMount = useRef(true);

  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Load data once on mount
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  // Update localStorage whenever the value changes, but skip the very first render
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error writing localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}
