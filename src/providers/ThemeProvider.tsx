"use client";
import "../app/globals.css";

import { ThemeProvider as TP } from "next-themes";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <TP enableSystem={true} attribute="class">
      {children}
    </TP>
  );
};

export default ThemeProvider;
