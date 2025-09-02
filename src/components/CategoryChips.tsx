import * as React from "react";
import { CATEGORIES, type CategoryId } from "@/data/categories";

type Props = {
  value: CategoryId | null;
  onChange: (next: CategoryId) => void;
  className?: string;
};

export default function CategoryChips({ value, onChange, className }: Props) {
  return (
    <div className={className}>
      {/* Scrollable row of chips */}
      <div
        role="radiogroup"
        aria-label="Category"
        className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1"
      >
        {CATEGORIES.map((c) => {
          const selected = c.id === value;
          return (
            <button
              key={c.id}
              type ="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(c.id)}
         // CategoryChips.tsx  → inside map() button className
// CategoryChips.tsx  → inside map() button className
className={[
  "shrink-0 inline-flex items-center gap-2",
  "px-4 py-3 rounded-full border text-base ",
  "bg-white text-gray-800 border-gray-200",
  "dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-800",
  "transition-colors active:scale-95",
  selected
    ? "border-emerald-500 ring-2 ring-emerald-200/60 dark:ring-emerald-400/30"
    : "hover:bg-gray-50 dark:hover:bg-zinc-800",
].join(" ")}

            >
              <span className="text-base">{c.icon}</span>
              <span>{c.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* Optional global CSS to hide scrollbars on mobile:
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
*/
