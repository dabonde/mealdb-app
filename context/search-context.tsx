"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Meal } from "@/types/meal";

interface SearchContextType {
  searchResults: Meal[] | null;
  setSearchResults: (results: Meal[] | null) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchResults, setSearchResults] = useState<Meal[] | null>(null);

  return (
    <SearchContext.Provider value={{ searchResults, setSearchResults }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
