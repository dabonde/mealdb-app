"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useShopping } from "@/context/shopping-context";
import { ShoppingCart, Trash2, X, ListChecks } from "lucide-react";
import { AppIcon } from "@/components/ui/app-icon";
import { EmptyState } from "@/components/ui/state-displays";
import { Badge } from "@/components/ui/badge";

export default function ShoppingList() {
  const { shoppingList, clearShoppingList, removeItem } = useShopping();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            aria-label="Open shopping list"
            className="border-primary/20 hover:bg-primary/5 relative h-10 gap-2 px-4 transition-all focus-visible:ring-offset-2"
          />
        }
      >
        <AppIcon name="utensils" />
        <span className="text-primary hidden text-sm font-bold md:inline">
          My List
        </span>
        {mounted && shoppingList.length > 0 && (
          <span className="bg-secondary text-secondary-foreground absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black shadow-sm ring-2 ring-white dark:ring-zinc-950">
            {shoppingList.length}
          </span>
        )}
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col border-l-0 p-0 sm:max-w-md sm:border-l">
        <div className="border-b bg-zinc-50 p-6 dark:bg-zinc-900">
          <SheetHeader className="space-y-1">
            <SheetTitle className="text-primary flex items-center gap-2 text-xl font-black">
              <ListChecks className="h-6 w-6" />
              Shopping List
            </SheetTitle>
            <SheetDescription className="text-sm">
              Alphabetical ingredients grouped by quantity.
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="flex-1 overflow-y-auto">
          {!mounted || shoppingList.length === 0 ? (
            <EmptyState
              message={!mounted ? "Loading list..." : "Your list is empty"}
              icon={<ShoppingCart className="text-primary/40 mb-3 h-10 w-10" />}
              className="h-full py-10"
            />
          ) : (
            <div className="flex h-full flex-col">
              {/* Table Header */}
              <div className="grid grid-cols-[1fr_auto_40px] border-b bg-zinc-100/50 px-6 py-3 text-[10px] font-black tracking-widest text-zinc-500 uppercase dark:bg-zinc-800/50">
                <span>Ingredient</span>
                <span className="pr-4 text-right">Quantity</span>
                <span className="text-center">Action</span>
              </div>

              {/* Table Body */}
              <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {shoppingList.map((item) => (
                  <li
                    key={item.name}
                    className="group grid grid-cols-[1fr_auto_40px] items-center px-6 py-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                  >
                    <span className="truncate pr-2 text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {item.name}
                    </span>
                    <div className="flex max-w-[140px] flex-wrap justify-end gap-1">
                      {item.measures.map((m, idx) => (
                        <Badge
                          key={idx}
                          variant="zinc"
                          className="px-2 py-0.5 leading-tight font-medium normal-case"
                        >
                          {m.count > 1 ? `${m.count} x ` : ""}
                          {m.value}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.name)}
                        className="hover:text-destructive hover:bg-destructive/10 h-7 w-7 text-zinc-300 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex items-center justify-between border-t bg-zinc-50 p-6 dark:bg-zinc-900">
                <span className="text-xs font-bold tracking-tight text-zinc-400 uppercase">
                  {shoppingList.length} Items Total
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearShoppingList}
                  className="text-destructive border-destructive/20 hover:bg-destructive h-8 px-3 text-xs font-bold transition-all hover:text-white"
                >
                  <Trash2 className="mr-2 h-3 w-3" />
                  Clear List
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
