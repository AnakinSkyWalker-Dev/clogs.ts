export const COLOR_NAMES = [
  "black", "red", "green", "yellow", "blue", "magenta", "cyan", "white",
  "gray", "orange", "pink", "lime", "indigo", "violet", "teal", "rose",
  "amber", "emerald", "sky", "purple", "brown", "gold", "silver", "navy",
  "olive", "maroon", "aqua", "turquoise", "mint", "coral", "salmon",
  "crimson", "lavender", "plum", "orchid", "beige", "khaki", "tan",
  "slate", "charcoal", "steel",
] as const;

export type ColorName = (typeof COLOR_NAMES)[number];