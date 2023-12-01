"use client";
import '../app/globals.css';

import { ThemeProvider as TP } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <TP enableSystem={true} attribute="class">
      {children}
    </TP>
  );
}
