import Image from "next/image";
import { cn } from "@/lib/utils";

export type AppIconName = "utensils" | "globe" | "home";

interface AppIconProps {
  name: AppIconName;
  size?: number;
  className?: string;
  alt?: string;
}

export function AppIcon({
  name,
  size = 18,
  className,
  alt = "",
}: AppIconProps) {
  return (
    <Image
      src={`/icons/${name}.svg`}
      alt={alt}
      width={size}
      height={size}
      aria-hidden="true"
      className={cn("dark:invert", className)}
    />
  );
}
