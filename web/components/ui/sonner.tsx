"use client";

import { Toaster } from "sonner";

export function SonnerToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        classNames: {
          toast: "bg-[color:var(--bg)] text-primary border border-stroke rounded-2xl shadow-xl",
          title: "text-sm font-semibold",
          description: "text-xs text-muted",
        },
      }}
    />
  );
}
