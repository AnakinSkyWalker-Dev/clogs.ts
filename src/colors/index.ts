import type { ColorMode, ColorName, ColorSet } from "../types/index.ts";
import { basicBg } from "./background/basic.ts";
import { c256Bg } from "./background/c256.ts";
import { truecolorBg } from "./background/truecolor.ts";
import esc from "./escape.ts";
import { basic } from "./foreground/basic.ts";
import { c256 } from "./foreground/c256.ts";
import { truecolor } from "./foreground/truecolor.ts";
import { getBgPalette, getPalette } from "./palette.ts";

export { esc };

const supportsColor = (): ColorMode => {
  if (typeof process === "undefined") return false;
  if (process.env.NO_COLOR) return false;
  if (
    process.env.COLORTERM === "truecolor" ||
    process.env.COLORTERM === "24bit"
  ) {
    return "truecolor";
  }
  if (
    process.env.TERM &&
    (process.env.TERM.includes("256") || process.env.TERM.includes("xterm"))
  ) {
    return "256";
  }
  return process.stdout?.isTTY ? "basic" : false;
};

export const colorMode: ColorMode = supportsColor();

export const bg = (color: ColorName, text: string): string => {
  const palette = getBgPalette();
  if (!palette) return text;
  return `${palette[color]}${text}${COLORS.reset}`;
};

export const fg = (color: ColorName, text: string): string => {
  const palette = getPalette();
  if (!palette) return text;
  return `${palette[color]}${text}${COLORS.reset}`;
};

export const COLORS: ColorSet = {
  reset: `${esc}[0m`,

  basic,
  c256,
  truecolor,
  bg: {
    basic: basicBg,
    c256: c256Bg,
    truecolor: truecolorBg,
  },
};
