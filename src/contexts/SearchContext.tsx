"use client";
import { createContext, useState, ReactNode } from "react";

export interface SearchContextProps {
  searchQuery: string;
  updateSearchQuery: (query: string) => void;
}

export const SearchContext = createContext<SearchContextProps | undefined>(
  undefined
);

export const SearchProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const updateSearchQuery = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <SearchContext.Provider
      value={{ searchQuery, updateSearchQuery }}
    >
      {children}
    </SearchContext.Provider>
  );
};
