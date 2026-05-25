import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { SearchProvider } from "@/context/search-context";
import { ShoppingProvider } from "@/context/shopping-context";
import ShoppingList from "@/components/shopping/shopping-list";
import SurpriseMeButton from "@/components/navigation/surprise-me-button";
import ErrorBoundary from "@/components/ui/error-boundary";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MealDB App",
  description: "Explore delicious recipes from around the world",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-zinc-50 dark:bg-zinc-950">
        <ShoppingProvider>
          <SearchProvider>
            <header className="sticky top-0 z-40 w-full border-b-2 border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80">
              <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <Link
                  href="/"
                  className="text-primary flex items-center gap-2 font-bold transition-colors hover:opacity-80"
                >
                  <Image
                    src="/icons/home.svg"
                    alt="Home"
                    width={20}
                    height={20}
                    className="dark:invert"
                  />
                  <span>MealDB App</span>
                </Link>

                <nav
                  className="flex items-center gap-2"
                  aria-label="Site Tools"
                >
                  <SurpriseMeButton />
                  <ShoppingList />
                </nav>
              </div>
            </header>
            {children}
            {modal}
          </SearchProvider>
        </ShoppingProvider>
      </body>
    </html>
  );
}
