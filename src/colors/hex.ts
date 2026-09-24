import type { Rgb } from "../types/index.ts";

export function hexToRgb(hex: string): Rgb {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);

  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}
