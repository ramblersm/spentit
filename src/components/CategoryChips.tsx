import * as React from "react";
import { CATEGORIES, CategoryId } from "@/data/categories";

type Props = {
  value: CategoryId | null;
  onChange: (next: CategoryId) => void;
  className?: string;
};

export default function CategoryChips({ value, onChange, className }: Props) {
  // Arrow-key nav (optional, nice on desktop)
  const containerRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-2">Category</label>

      {/* Horizontal scrollable row */}
      <div
        ref={containerRef}
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
                "px-3 py-2 rounded-full border text-sm",
                "transition-transform active:scale-95",
                selected
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-800 border-gray-200 dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-800",
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

/* Hide scrollbar utility (add once globally if you like)
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
*/
