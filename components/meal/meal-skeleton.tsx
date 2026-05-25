import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default function CardSkeleton() {
  return (
    <Card className="flex h-full animate-pulse flex-col overflow-hidden">
      {/* Image placeholder */}
      <div className="aspect-video bg-zinc-100 dark:bg-zinc-800" />

      <CardHeader className="p-4 pb-2">
        {/* Title placeholder */}
        <div className="h-6 w-3/4 rounded bg-zinc-100 dark:bg-zinc-800" />
      </CardHeader>

      <CardContent className="flex-1 p-4 pt-0">
        <div className="mt-2 space-y-4">
          {/* Category line */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-zinc-50 dark:bg-zinc-800" />
            <div className="flex-1 space-y-2">
              <div className="h-2 w-16 rounded bg-zinc-50 dark:bg-zinc-800" />
              <div className="h-3 w-24 rounded bg-zinc-100 dark:bg-zinc-800" />
            </div>
          </div>

          {/* Country line */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-zinc-50 dark:bg-zinc-800" />
            <div className="flex-1 space-y-2">
              <div className="h-2 w-16 rounded bg-zinc-50 dark:bg-zinc-800" />
              <div className="h-3 w-20 rounded bg-zinc-100 dark:bg-zinc-800" />
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {/* Button placeholder */}
        <div className="h-9 w-full rounded bg-zinc-100 dark:bg-zinc-800" />
      </CardFooter>
    </Card>
  );
}
