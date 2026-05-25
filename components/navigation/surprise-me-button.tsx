"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { useRandomMeal } from "@/lib/api-hooks";

export default function SurpriseMeButton() {
  const router = useRouter();
  const { fetchRandomMeal, loading } = useRandomMeal();

  const handleSurprise = async () => {
    const randomMeal = await fetchRandomMeal();
    if (randomMeal) {
      router.push(`/meal/${randomMeal.idMeal}`);
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleSurprise}
      disabled={loading}
      aria-label="Get a random meal recipe"
      className="gap-2 text-zinc-600 hover:bg-blue-50 hover:text-blue-600 focus-visible:ring-offset-2 dark:text-zinc-400 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="h-4 w-4" />
      )}
      <span className="hidden md:inline">Surprise Me</span>
    </Button>
  );
}
