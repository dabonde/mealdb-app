"use client";

import { useSearch } from "@/context/search-context";
import { useEffect, useState, use } from "react";
import { Meal } from "@/types/meal";
import Modal from "@/components/modal-wrapper";
import MealDetails from "@/components/meal/meal-details";
import { useMealLookup } from "@/lib/api-hooks";
import { LoadingState, ErrorState } from "@/components/ui/state-displays";

export default function MealModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { searchResults } = useSearch();
  const [meal, setMeal] = useState<Meal | null>(null);
  const { lookupMeal, loading } = useMealLookup();

  useEffect(() => {
    const existingMeal = searchResults?.find((m) => m.idMeal === id);

    if (existingMeal) {
      setMeal(existingMeal);
    } else {
      lookupMeal(id).then(setMeal);
    }
  }, [id, searchResults, lookupMeal]);

  return (
    <Modal title={meal ? `Details for ${meal.strMeal}` : "Meal Details"}>
      {loading ? (
        <LoadingState message="Loading meal details..." className="py-10" />
      ) : meal ? (
        <MealDetails meal={meal} />
      ) : (
        <ErrorState message="Meal not found." className="py-10" />
      )}
    </Modal>
  );
}
