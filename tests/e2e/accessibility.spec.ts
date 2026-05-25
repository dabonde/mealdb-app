import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility Audits", () => {
  test.beforeEach(async ({ page }) => {
    // Mock the API responses to ensure test isolation and reliability
    await page.route(/.*\/search\.php\?s=.*/, async (route) => {
      const url = new URL(route.request().url());
      const query = url.searchParams.get("s");

      if (query === "Chicken") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            meals: [
              {
                idMeal: "52772",
                strMeal: "Teriyaki Chicken Casserole",
                strCategory: "Chicken",
                strArea: "Japanese",
                strMealThumb:
                  "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
                strInstructions: "Mock instructions...",
                strIngredient1: "soy sauce",
                strMeasure1: "3/4 cup",
              },
            ],
          }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ meals: [] }),
        });
      }
    });
  });

  test("home page should have no detectable accessibility violations", async ({
    page,
  }) => {
    await page.goto("/");

    // We wait for the page to be fully hydrated
    await expect(
      page.getByText("Search for a meal to see results")
    ).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("search results should have no detectable accessibility violations", async ({
    page,
  }) => {
    await page.goto("/");

    const searchInput = page.getByLabel("Search Meals");
    await searchInput.fill("Chicken");
    await page.getByRole("button", { name: "Search", exact: true }).click();

    // Wait for the results to appear
    await expect(
      page.locator('section[aria-label="Search Results"]')
    ).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
