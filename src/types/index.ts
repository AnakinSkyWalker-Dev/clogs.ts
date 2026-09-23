export * from './logger.ts';

export type ColorMode = "truecolor" | "256" | "basic" | false;

export type BasicColorName =
  "black" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white";

export type ExtendedColorName =
  | "gray"
  | "blue"
  | "yellow"
  | "red"
  | "green"
  | "magenta"
  | "cyan"
  | "white"
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

export type Palette = Record<ColorName, string>;

export type BasicBgPalette = Palette & {
  brightBackground: Record<BasicColorName, string>;
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
