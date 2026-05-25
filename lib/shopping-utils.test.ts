import { describe, it, expect } from "vitest";
import {
  parseMeasure,
  mergeMealIntoList,
  getMealIngredients,
  ShoppingItem,
} from "./shopping-utils";
import { Meal } from "@/types/meal";

describe("getMealIngredients", () => {
  it("should extract valid ingredients and measures", () => {
    const meal: Partial<Meal> = {
      strIngredient1: "Chicken",
      strMeasure1: "1kg",
      strIngredient2: "Onion",
      strMeasure2: "2",
      strIngredient3: "", // Should be skipped
      strMeasure3: "",
    };

    const result = getMealIngredients(meal as Meal);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ name: "Chicken", measure: "1kg" });
    expect(result[1]).toEqual({ name: "Onion", measure: "2" });
  });

  it("should handle all 20 ingredients", () => {
    const meal: any = {};
    for (let i = 1; i <= 20; i++) {
      meal[`strIngredient${i}`] = `Ingredient ${i}`;
      meal[`strMeasure${i}`] = `${i} unit`;
    }

    const result = getMealIngredients(meal as Meal);
    expect(result).toHaveLength(20);
    expect(result[19]).toEqual({ name: "Ingredient 20", measure: "20 unit" });
  });

  it("should trim whitespace from ingredients and measures", () => {
    const meal: Partial<Meal> = {
      strIngredient1: "  Garlic  ",
      strMeasure1: " 3 cloves ",
    };

    const result = getMealIngredients(meal as Meal);
    expect(result[0]).toEqual({ name: "Garlic", measure: "3 cloves" });
  });
});

describe("parseMeasure", () => {
  it("should parse simple numeric strings", () => {
    expect(parseMeasure("2")).toEqual({ amount: 2, unit: "" });
    expect(parseMeasure("2.5")).toEqual({ amount: 2.5, unit: "" });
  });

  it("should parse numeric strings with units", () => {
    expect(parseMeasure("2 tsp")).toEqual({ amount: 2, unit: "tsp" });
    expect(parseMeasure("1.5 cups")).toEqual({ amount: 1.5, unit: "cups" });
    expect(parseMeasure("500g")).toEqual({ amount: 500, unit: "g" });
  });

  it("should parse fractions", () => {
    expect(parseMeasure("1/2")).toEqual({ amount: 0.5, unit: "" });
    expect(parseMeasure("1 1/2 tsp")).toEqual({ amount: 1.5, unit: "tsp" });
  });

  it("should return null for non-numeric strings", () => {
    expect(parseMeasure("pinch")).toBeNull();
    expect(parseMeasure("to taste")).toBeNull();
  });
});

describe("mergeMealIntoList", () => {
  const mockMeal: Partial<Meal> = {
    idMeal: "1",
    strMeal: "Test Meal",
    strIngredient1: "Salt",
    strMeasure1: "2 tsp",
    strIngredient2: "Sugar",
    strMeasure2: "1 cup",
    strIngredient3: "Eggs",
    strMeasure3: "2",
  };

  it("should create a new list from an empty list", () => {
    const result = mergeMealIntoList([], mockMeal as Meal);
    expect(result).toHaveLength(3);
    expect(result[0].name).toBe("Eggs");
    expect(result[0].measures[0].value).toBe("2");
  });

  it("should add quantities with the same unit", () => {
    const initialList: ShoppingItem[] = [
      { name: "Salt", measures: [{ value: "3 tsp", count: 1 }] },
    ];
    const result = mergeMealIntoList(initialList, mockMeal as Meal);
    const salt = result.find((i) => i.name === "Salt");
    expect(salt?.measures[0].value).toBe("5 tsp");
  });

  it("should keep quantities separate if units differ", () => {
    const initialList: ShoppingItem[] = [
      { name: "Salt", measures: [{ value: "1 tbsp", count: 1 }] },
    ];
    const result = mergeMealIntoList(initialList, mockMeal as Meal);
    const salt = result.find((i) => i.name === "Salt");
    expect(salt?.measures).toHaveLength(2);
    expect(salt?.measures.some((m) => m.value === "1 tbsp")).toBe(true);
    expect(salt?.measures.some((m) => m.value === "2 tsp")).toBe(true);
  });

  it("should fallback to count multiplier for non-numeric measures", () => {
    const mealWithPinch: Partial<Meal> = {
      strIngredient1: "Pepper",
      strMeasure1: "pinch",
    };
    const initialList: ShoppingItem[] = [
      { name: "Pepper", measures: [{ value: "pinch", count: 1 }] },
    ];
    const result = mergeMealIntoList(initialList, mealWithPinch as Meal);
    const pepper = result.find((i) => i.name === "Pepper");
    expect(pepper?.measures[0].count).toBe(2);
  });
});
