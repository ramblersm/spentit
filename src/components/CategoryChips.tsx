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
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(c.id)}
          className={[
  "shrink-0 inline-flex items-center gap-2",
  "px-4 py-3 rounded-full border text-base min-h-11",
  "bg-transparent text-gray-800 border-gray-300",
  "dark:text-zinc-100 dark:border-zinc-700",
  "transition-colors active:scale-95",
  selected
    ? "border-emerald-500 text-emerald-700 dark:text-emerald-300"
    : "hover:border-gray-400 dark:hover:border-zinc-600",
].join(" ")}

            >
              <span className="text-lg">{c.icon}</span>
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
