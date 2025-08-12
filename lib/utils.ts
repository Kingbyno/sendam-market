import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formats a number as currency, with optional negative styling
export function formatCurrency(value: number, includeSymbol = true, negativeStyle?: string) {
  const absValue = Math.abs(value);
  const sign = value < 0 ? (negativeStyle || "-") : "";
  const formattedValue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(absValue);

  return `${sign}${includeSymbol ? "$" : ""}${formattedValue}`;
}

// Formats a number as a percentage
export function formatPercentage(value: number, decimalPlaces: number = 2) {
  return `${value.toFixed(decimalPlaces)}%`;
}

export function formatPrice(
  price: number | string | null | undefined,
  currency: string = "NGN",
) {
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;
  if (numericPrice == null || isNaN(numericPrice)) {
    return "N/A";
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(numericPrice);
}

// Maps category names to simple emoji icons for the marketplace UI
export function getCategoryIcon(categoryName: string): string {
  const lowerCaseCategory = categoryName.toLowerCase();

  if (lowerCaseCategory.includes("phone") || lowerCaseCategory.includes("mobile")) return "📱";
  if (lowerCaseCategory.includes("computer") || lowerCaseCategory.includes("laptop")) return "💻";
  if (lowerCaseCategory.includes("tv") || lowerCaseCategory.includes("audio")) return "📺";
  if (lowerCaseCategory.includes("appliance")) return "🔌";
  if (lowerCaseCategory.includes("fashion") || lowerCaseCategory.includes("clothing")) return "👕";
  if (lowerCaseCategory.includes("beauty") || lowerCaseCategory.includes("health")) return "💄";
  if (lowerCaseCategory.includes("home") || lowerCaseCategory.includes("office")) return "🏠";
  if (lowerCaseCategory.includes("game") || lowerCaseCategory.includes("gaming")) return "🎮";
  if (lowerCaseCategory.includes("book")) return "📚";
  if (lowerCaseCategory.includes("sport")) return "⚽";
  if (lowerCaseCategory.includes("car") || lowerCaseCategory.includes("automotive")) return "🚗";

  // Default icon if no match is found
  return "📦";
}
