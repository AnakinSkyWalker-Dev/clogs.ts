export type ColorMode = "truecolor" | "256" | "basic" | false;

export type BasicColorName =
  "black" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white";

export type ExtendedColorName =
  | "gray"
  | "orange"
  | "pink"
  | "lime"
  | "indigo"
  | "violet"
  | "teal"
  | "rose"
  | "amber"
  | "emerald"
  | "sky"
  | "purple"
  | "brown"
  | "gold"
  | "silver"
  | "navy"
  | "olive"
  | "maroon"
  | "aqua"
  | "turquoise"
  | "mint"
  | "coral"
  | "salmon"
  | "crimson"
  | "lavender"
  | "plum"
  | "orchid"
  | "beige"
  | "khaki"
  | "tan"
  | "slate"
  | "charcoal"
  | "steel";

export type ColorName = BasicColorName | ExtendedColorName;

export type ColorTarget = "fg" | "bg";

export type BasicAlias = {
  base: BasicColorName;
  bright?: true;
};

export type Rgb = {
  r: number;
  g: number;
  b: number;
};

export type Palette = Record<ColorName, string>;

export type BasicPalette = Record<BasicColorName, string>;

export type BasicBgPalette = Palette & {
  brightBackground: BasicPalette;
};

export type ColorSet = {
  reset: string;
  basic: Palette;
  c256: Palette;
  truecolor: Palette;
  bg: {
    basic: BasicBgPalette;
    c256: Palette;
    truecolor: Palette;
  };
};

export type BasicFg = "30" | "31" | "32" | "33" | "34" | "35" | "36" | "37";

export type BasicBrightFg =
  "90" | "91" | "92" | "93" | "94" | "95" | "96" | "97";

export type BasicBgCode = "40" | "41" | "42" | "43" | "44" | "45" | "46" | "47";

export type BasicBrightBg =
  "100" | "101" | "102" | "103" | "104" | "105" | "106" | "107";
