import "./globals.css";
import { Inter } from "next/font/google";

import ThemeProvider from "@/src/providers/ThemeProvider";
import SearchProvider from "@/src/providers/SearchProvider";
import QueryProvider from "@/src/providers/QueryProvider";
import Navbar from "@/src/components/Navbar/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sentiment News",
  description: "A financial news app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <SearchProvider>
            <QueryProvider>
              <Navbar />
              {children}
            </QueryProvider>
          </SearchProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
