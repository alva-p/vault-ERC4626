"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Switch } from "@/components/ui/switch";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-3 rounded-full border border-stroke bg-glass px-4 py-2 text-xs uppercase tracking-[0.3em] text-muted">
        Theme
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-full border border-stroke bg-glass px-4 py-2 text-xs uppercase tracking-[0.3em] text-muted">
      {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      Theme
      <Switch checked={isDark} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />
    </div>
  );
}
