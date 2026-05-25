import { Meal } from "@/types/meal";
import { MEAL_DB_MAX_INGREDIENTS } from "./constants";

export interface MeasureItem {
  value: string;
  count: number;
}

export interface ShoppingItem {
  name: string;
  measures: MeasureItem[];
}

// Helper to parse "2 tsp" into { amount: 2, unit: "tsp" }
export function parseMeasure(measure: string) {
  const trimmed = measure.trim().toLowerCase();
  if (!trimmed) return null;

  /**
   * This regex splits a measurement string into two parts:
   * 1. A numeric value (Capture Group 1): Matches digits, spaces, dots, slashes, or hyphens.
   *    Handles: "2", "2.5", "1/2", "1 1/2", "1-2"
   * 2. The unit (Capture Group 2): Matches any remaining text after optional whitespace.
   *    Handles: "tsp", "cups", "g", "ml"
   */
  const match = trimmed.match(/^(\d+[\d\s./-]*)\s*(.*)$/);

  if (match) {
    const amountStr = match[1].trim();
    const unit = match[2].trim();

    let amount = 0;
    if (amountStr.includes("/")) {
      const parts = amountStr.split(/\s+/);
      let total = 0;
      parts.forEach((p) => {
        if (p.includes("/")) {
          const [num, den] = p.split("/").map(Number);
          if (!isNaN(num) && !isNaN(den) && den !== 0) {
            total += num / den;
          }
        } else {
          const n = Number(p);
          if (!isNaN(n)) total += n;
        }
      });
      amount = total;
    } else {
      amount = parseFloat(amountStr);
    }

    if (!isNaN(amount)) {
      return { amount, unit };
    }
  }

  return null;
}

export function formatAmount(amount: number) {
  return parseFloat(amount.toFixed(2)).toString();
}

export interface IngredientPair {
  name: string;
  measure: string;
}

/**
 * Extracts ingredients and measures from a Meal object into a clean array of pairs.
 */
export function getMealIngredients(meal: Meal): IngredientPair[] {
  const ingredients: IngredientPair[] = [];

  for (let i = 1; i <= MEAL_DB_MAX_INGREDIENTS; i++) {
    const name = (meal[`strIngredient${i}` as keyof Meal] as string)?.trim();
    const measure =
      (meal[`strMeasure${i}` as keyof Meal] as string)?.trim() || "";

    if (name) {
      ingredients.push({ name, measure });
    }
  }

  return ingredients;
}

export function mergeMealIntoList(
  currentList: ShoppingItem[],
  meal: Meal
): ShoppingItem[] {
  // Use a Map for O(1) ingredient lookups
  const ingredientMap = new Map<string, ShoppingItem>();

  // Initialize Map with current items
  currentList.forEach((item) => {
    ingredientMap.set(item.name.toLowerCase(), {
      ...item,
      measures: item.measures.map((m) => ({ ...m })),
    });
  });

  const ingredients = getMealIngredients(meal);

  ingredients.forEach(({ name, measure }) => {
    const normalizedName = name.toLowerCase();
    const parsed = parseMeasure(measure);
    const existingItem = ingredientMap.get(normalizedName);

    if (existingItem) {
      if (parsed) {
        // Try to find a measure with the same unit
        const sameUnitMeasure = existingItem.measures.find((m) => {
          const p = parseMeasure(m.value);
          return p && p.unit === parsed.unit;
        });

        if (sameUnitMeasure) {
          const existingParsed = parseMeasure(sameUnitMeasure.value)!;
          const newAmount = existingParsed.amount + parsed.amount;
          const unitSuffix = parsed.unit ? ` ${parsed.unit}` : "";
          sameUnitMeasure.value = `${formatAmount(newAmount)}${unitSuffix}`;
        } else {
          existingItem.measures.push({ value: measure, count: 1 });
        }
      } else {
        // No numeric part, look for exact string match
        const existingMeasure = existingItem.measures.find(
          (m) => m.value.toLowerCase() === measure.toLowerCase()
        );

        if (existingMeasure) {
          existingMeasure.count += 1;
        } else {
          existingItem.measures.push({ value: measure, count: 1 });
        }
      }
    } else {
      ingredientMap.set(normalizedName, {
        name: name, // Keep original casing
        measures: [{ value: measure, count: 1 }],
      });
    }
  });

  // Convert Map back to array and sort
  return Array.from(ingredientMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}
