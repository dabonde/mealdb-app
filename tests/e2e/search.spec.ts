import { test, expect } from "@playwright/test";

test.describe("Search Functionality", () => {
  test.beforeEach(async ({ page }) => {
    // Mock the API responses to ensure test isolation and reliability
    // Using a regex to match the search endpoint regardless of query string in the glob
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

  test("should allow users to search for meals and see results", async ({
    page,
  }) => {
    // Capture console logs
    page.on("console", (msg) => console.log(`BROWSER LOG: ${msg.text()}`));

    // Capture failed requests
    page.on("requestfailed", (request) => {
      console.log(
        `REQUEST FAILED: ${request.url()} - ${request.failure()?.errorText}`
      );
    });

    // 1. Navigate to the home page
    await page.goto("/");

    // 2. Verify initial empty state message is present
    await expect(
      page.getByText("Search for a meal to see results")
    ).toBeVisible();

    // 3. Find the search input and type "Chicken"
    const searchInput = page.getByLabel("Search Meals");
    await searchInput.clear(); // Ensure it's empty
    await searchInput.fill("Chicken");

    // 4. Click the Search button
    await page.getByRole("button", { name: "Search", exact: true }).click();

    // 5. Wait for results, validation error, or API error
    const validationError = page.locator("#search-error");
    const apiError = page.locator(
      'section[aria-label="Meal Search"] div[role="alert"]'
    );
    const resultsGrid = page.locator('section[aria-label="Search Results"]');

    // We wait until one of the expected elements becomes visible.
    // This is more idiomatic than Promise.race for Playwright reports.
    await expect(async () => {
      const isVisible = await Promise.all([
        resultsGrid.isVisible(),
        validationError.isVisible(),
        apiError.isVisible(),
      ]);
      expect(isVisible.some((v) => v)).toBeTruthy();
    }).toPass({ timeout: 15000 });

    if (await validationError.isVisible()) {
      const message = await validationError.innerText();
      throw new Error(`Form validation failed: ${message}`);
    }

    if (await apiError.isVisible()) {
      const message = await apiError.innerText();
      if (message.trim()) {
        throw new Error(`API error detected: ${message}`);
      }
    }

    // Ensure results grid is actually visible if we reached here without errors
    await expect(resultsGrid).toBeVisible();

    // 6. Verify specific content in the results
    const mealCards = page.locator("article");
    await expect(mealCards.first()).toBeVisible();

    const firstCard = mealCards.first();
    // Using a more flexible locator for the link
    await expect(firstCard.locator('a:has-text("View Details")')).toBeVisible();

    // 7. Verify search query limit (try to type more than 100 chars)
    const longQuery = "a".repeat(101);
    await searchInput.fill(longQuery);

    // The input should have truncated the value to 100
    const inputValue = await searchInput.inputValue();
    expect(inputValue.length).toBe(100);
  });
});
