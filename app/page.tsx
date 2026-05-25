import Search from "@/components/search/search-container";
import ErrorBoundary from "@/components/ui/error-boundary";

export default function Home() {
  return (
    <ErrorBoundary>
      <div className="flex min-h-screen font-sans">
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-10">
            <header className="flex flex-col items-center gap-4 sm:items-start">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                Find your next meal
              </h1>
              <p className="text-muted-foreground text-xl">
                Search through thousands of recipes from TheMealDB.
              </p>
            </header>

            <section aria-label="Meal Search">
              <Search />
            </section>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}
