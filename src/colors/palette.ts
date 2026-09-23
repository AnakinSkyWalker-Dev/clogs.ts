import type { Palette } from "../types/index.ts";
import { colorMode, COLORS } from "./index.ts";

function detectPalette(
  palettes: {
    truecolor: Palette;
    c256: Palette;
    basic: Palette;
  },
): Palette | null {
  switch (colorMode) {
    case "truecolor":
      return palettes.truecolor;
    case "256":
      return palettes.c256;
    case "basic":
      return palettes.basic;
    default:
      return null;
  }
}

export const getPalette = (): Palette | null => detectPalette(COLORS);

export const getBgPalette = (): Palette | null => detectPalette(COLORS.bg);
