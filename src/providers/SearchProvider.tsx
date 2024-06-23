"use client";
import { createContext, useState, ReactNode } from "react";

export interface SearchContextProps {
  searchQuery: string;
  updateSearchQuery: (query: string) => void;
}

export const SearchContext = createContext<SearchContextProps | undefined>(undefined);

const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const updateSearchQuery = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <SearchContext.Provider value={{ searchQuery, updateSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchProvider;
