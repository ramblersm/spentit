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
              "transition-transform active:scale-95",
                selected
                    // Selected: a bit deeper green, still soft
                    ? "bg-emerald-200 text-emerald-900 border-emerald-300"
                    // Unselected: very light green background, darker green text
                    : "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800",
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
