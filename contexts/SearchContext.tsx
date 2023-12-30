"use client";
import { createContext, useState, ReactNode } from "react";

export interface SearchContextProps {
  searchQuery: string;
  category: string;
  updateSearchQuery: (query: string) => void;
  updateCategory: (category: string) => void;
}

export const SearchContext = createContext<SearchContextProps | undefined>(
  undefined
);

export const SearchProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");

  const updateSearchQuery = (query: string) => {
    setSearchQuery(query);
  };

  const updateCategory = (newCategory: string) => {
    setCategory(newCategory);
  };

  return (
    <SearchContext.Provider
      value={{ searchQuery, category, updateSearchQuery, updateCategory }}
    >
      {children}
    </SearchContext.Provider>
  );
};
