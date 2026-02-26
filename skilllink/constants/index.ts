export const COLORS = {
  primary: "#2563eb",
  primaryDark: "#1d4ed8",
  secondary: "#64748b",
  background: "#f8fafc",
  card: "#ffffff",
  border: "#e2e8f0",
  text: "#0f172a",
  textMuted: "#64748b",
  success: "#22c55e",
  warning: "#eab308",
  error: "#ef4444",
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const CATEGORIES = [
  "Electrician",
  "Plumber",
  "Carpenter",
  "Painter",
  "Cleaner",
  "Mechanic",
  "AC technician",
  "Gardener",
  "Moving help",
  "Handyman",
] as const;

export type Category = (typeof CATEGORIES)[number];
