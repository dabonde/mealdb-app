"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";

type Props = {
  children: React.ReactNode;
  title?: string;
};

export default function Modal({ children, title = "Meal Details" }: Props) {
  const router = useRouter();

  function onOpenChange(open: boolean) {
    if (!open) {
      router.back();
    }
  }

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[95vw] max-w-7xl overflow-hidden border-2 bg-white p-0 shadow-none md:w-[80vw] dark:bg-zinc-900"
        aria-describedby={undefined}
      >
        <VisuallyHidden>
          <DialogTitle>{title}</DialogTitle>
        </VisuallyHidden>
        <div className="max-h-[90vh] overflow-auto p-6 pt-12">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
