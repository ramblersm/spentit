export type CategoryId =
  | "food"
  | "travel"
  | "groceries"
  | "shopping"
  | "utilities"
  | "entertainment"
  | "health"
  | "misc";

export type Category = {
  id: CategoryId;
  label: string;
  icon: string; // emoji for fast, mobile-friendly visual cues
};

export const CATEGORIES: Category[] = [
  { id: "food",          label: "Food",         icon: "🍔" },
  { id: "travel",        label: "Travel",       icon: "🚕" },
  { id: "groceries",     label: "Groceries",    icon: "🛒" },
  { id: "shopping",      label: "Shopping",     icon: "🧺" },
  { id: "utilities",     label: "Utilities",    icon: "💡" },
  { id: "entertainment", label: "Fun",          icon: "🎉" },
  { id: "health",        label: "Health",       icon: "💊" },
  { id: "misc",          label: "Other",        icon: "📦" },
];

// Handy lookup if you want icon+label by id
export const CATEGORY_MAP: Record<CategoryId, { label: string; icon: string }> =
  CATEGORIES.reduce((acc, c) => {
    acc[c.id] = { label: c.label, icon: c.icon };
    return acc;
  }, {} as Record<CategoryId, { label: string; icon: string }>);
