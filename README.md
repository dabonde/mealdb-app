# 🥘 MealDB Explorer - Technical Test Submission

A modern, responsive, and accessible recipe exploration application built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**.

## 🚀 Key Features

- **Recipe Search:** Search through thousands of recipes from TheMealDB.
- **Surprise Me:** Instant navigation to a random meal recipe.
- **Smart Shopping List:** Aggregates ingredients across multiple recipes, automatically grouping by quantity and normalizing measurements.
- **Responsive & Accessible:** Built with a mobile-first approach and WCAG guidelines in mind (ARIA roles, semantic HTML, keyboard navigation).
- **Resilient UI:** Implements custom Error Boundaries and robust API error handling to ensure a smooth user experience even during failures.

## 🛠 Technical Architecture

### Core Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript for type safety across API responses and components.
- **Styling:** Vanilla CSS & Tailwind CSS for flexible, performant design.
- **State Management:** React Context API for cross-cutting concerns like Shopping List and Search persistence.
- **Testing:**
  - **Vitest:** High-performance unit testing for utility logic and hooks.
  - **Playwright:** End-to-end testing for critical user paths (Search, Navigation).

## 🛠 Technical Architecture & Implementation Notes

### 1. Advanced Routing (Intercepting Routes)

The application utilizes Next.js **Intercepting Routes** (`(.)meal/[id]`) combined with **Parallel Routes** (`@modal`).

- **Context Preservation:** When navigating from search results, the meal details open in a modal, preserving the user's search state in the background.
- **Deep Linking:** Refreshing the page or sharing the URL directly loads the full-page recipe (`/meal/[id]`), ensuring the app is shareable and SEO-friendly.

### 2. Data Normalization & Persistence

The **Shopping List** involves specialized logic (`lib/shopping-utils.ts`):

- **Ingredient Aggregation:** Parses and merges ingredients from different recipes.
- **Unit Normalization:** Handles basic unit grouping (e.g., merging "1 cup" and "2 cups") to ensure the list remains practical.
- **Hydration Safe:** A custom `useLocalStorage` hook handles state persistence, with specific logic to prevent "Hydration Mismatch" errors common in Next.js SSR.

### 3. Accessibility-First Design

Accessibility is built into the foundation and verified automatically:

- **Automated Audits:** Axe-Core audits are integrated into the E2E suite (`npm run test:a11y`).
- **Focus Management:** Modals implement the WAI-ARIA Dialog pattern, including focus trapping.
- **Live Regions:** `aria-live` regions provide audible feedback for background actions like "Add to List" and search completions.

### 4. Defensive UI

- **Error Boundaries:** A global React Error Boundary catches rendering crashes, providing a graceful fallback.
- **API Resilience:** Custom hooks handle various API failure states (connectivity, server errors) with user-facing feedback rather than silent failures.

## 🧪 Testing Strategy

The project maintains a high standard of quality through multi-layered testing:

- **Unit Tests:** `npm test` runs the Vitest suite, focusing on measurement normalization and local storage persistence logic.
- **E2E Tests:** `npm run test:e2e` executes Playwright specs. These tests use **API Stubbing** (via `page.route`) to mock TheMealDB responses, ensuring the test suite is isolated, deterministic, and doesn't depend on external network conditions.
- **Accessibility Audits:** `npm run test:a11y` runs automated WCAG audits via axe-core to ensure semantic integrity.

## 📈 Future Trade-offs & Roadmap

Given more time, the following enhancements would be prioritized:

1.  **Image Optimization:** Implement a blur-up placeholder strategy for high-resolution meal thumbnails.
2.  **Advanced Filtering:** Add server-side filtering by Category or Area.
3.  **Offline Support:** Enhance the `useLocalStorage` hook with a Service Worker for a full PWA experience.
4.  **Skeleton Screens:** Further refine the loading experience with more granular shimmer effects.

---

## 🚦 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build & Production

```bash
npm run build
npm start
```

### Running Tests

```bash
# Unit Tests
npm test

# E2E Tests
npm run test:e2e
```
