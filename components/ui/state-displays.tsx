import { Loader2, AlertCircle, Inbox, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

interface StateDisplayProps {
  message: string;
  className?: string;
  icon?: React.ReactNode;
}

export function LoadingState({ message, className }: StateDisplayProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 text-center",
        className
      )}
    >
      <Loader2 className="text-primary mb-4 h-10 w-10 animate-spin" />
      <p className="font-medium text-zinc-500">{message}</p>
    </div>
  );
}

export function ErrorState({ message, className }: StateDisplayProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 text-center",
        className
      )}
      role="alert"
    >
      <AlertCircle className="text-destructive mb-4 h-10 w-10" />
      <p className="text-destructive font-bold">{message}</p>
    </div>
  );
}

export function EmptyState({ message, className, icon }: StateDisplayProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-20 text-center opacity-60",
        className
      )}
    >
      {icon || <Inbox className="text-primary/40 mb-3 h-10 w-10" />}
      <p className="text-primary text-xl font-bold">{message}</p>
    </div>
  );
}
