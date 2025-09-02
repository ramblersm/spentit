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
      <div
        role="radiogroup"
        aria-label="Category"
        className="
          flex items-center gap-2
          overflow-x-auto whitespace-nowrap
          touch-pan-x
          -mx-1 px-1 py-1
          [&::-webkit-scrollbar]:hidden
          [-ms-overflow-style:'none']
          [scrollbar-width:'none']
        "
      >
        {CATEGORIES.map((c) => {
          const selected = c.id === value;
          return (
            <button
              key={c.id}
              type="button" // important so it doesn't submit the form
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(c.id)}
              className={[
                "flex-none inline-flex items-center gap-1.5",
                "px-3 py-2 rounded-full border text-sm min-h-10",
                "transition-colors active:scale-95",
                selected
                  ? "bg-emerald-600 text-white border-emerald-700"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200",
              ].join(" ")}
            >
              <span className="text-sm">{c.icon}</span>
              <span>{c.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
