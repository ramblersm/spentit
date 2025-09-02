export type CategoryId =
  | "food"
  | "travel"
  | "groceries"
  | "shopping"
  | "utilities"
  | "entertainment"
  | "health"
  | "other";

export type Category = {
  id: CategoryId;
  label: string;
  icon: string; // use emoji for now (fast + great on mobile)
};

export const CATEGORIES: Category[] = [
  { id: "food", label: "Food", icon: "🍔" },
  { id: "travel", label: "Travel", icon: "🚕" },
  { id: "groceries", label: "Groceries", icon: "🛒" },
  { id: "shopping", label: "Shopping", icon: "🧺" },
  { id: "utilities", label: "Utilities", icon: "💡" },
  { id: "entertainment", label: "Fun", icon: "🎉" },
  { id: "health", label: "Health", icon: "💊" },
  { id: "other", label: "Other", icon: "📦" },
];
