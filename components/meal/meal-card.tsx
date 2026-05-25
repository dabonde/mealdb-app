"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { AppIcon } from "@/components/ui/app-icon";
import { Meal } from "@/types/meal";
import { CLICK_THRESHOLD_MS } from "@/lib/constants";

type Props = {
  data: Meal;
};

export default function MealCard(props: Props) {
  const { data } = props;
  const router = useRouter();
  const [mouseDownTime, setMouseDownTime] = useState<number>(0);

  const url = useMemo(() => {
    return `/meal/${data.idMeal}`;
  }, [data.idMeal]);

  const handleMouseDown = () => {
    setMouseDownTime(Date.now());
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    const mouseUpTime = Date.now();
    const duration = mouseUpTime - mouseDownTime;

    if (duration < CLICK_THRESHOLD_MS) {
      router.push(url);
    }
  };

  return (
    <Card
      as="article"
      className="relative flex h-full cursor-pointer flex-col overflow-hidden border-2 transition-all active:scale-[0.99]"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          src={data.strMealThumb}
          alt={data.strMeal}
        />
      </div>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="line-clamp-1 text-xl">{data.strMeal}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-4 pt-0">
        <div className="mt-2 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
              <AppIcon name="utensils" />
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px] font-medium tracking-wider uppercase">
                Category
              </span>
              <span className="text-sm font-semibold">{data.strCategory}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">
              <AppIcon name="globe" />
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px] font-medium tracking-wider uppercase">
                Area
              </span>
              <span className="text-sm font-semibold">{data.strArea}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          render={<Link href={url} className="after:absolute after:inset-0" />}
          className="bg-primary hover:bg-primary/90 text-primary-foreground w-full font-bold"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
