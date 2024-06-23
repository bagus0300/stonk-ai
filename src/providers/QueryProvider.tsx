"use client";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const QueryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default QueryProvider;
