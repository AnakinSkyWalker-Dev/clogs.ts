import type {
  BasicBgCode,
  BasicBrightBg,
  BasicBrightFg,
  BasicColorName,
  BasicFg,
  BasicPalette,
  ColorName,
  ColorTarget,
  Palette,
} from "../types/index.ts";
import { BASIC_ALIAS, COLOR_HEX } from "./definitions.ts";
import esc from "./escape.ts";
import { hexToRgb } from "./hex.ts";

const C256_LEVELS = [0, 95, 135, 175, 215, 255];

const BASIC_FG: Record<BasicColorName, [BasicFg, BasicBrightFg]> = {
  black: ["30", "90"],
  red: ["31", "91"],
  green: ["32", "92"],
  yellow: ["33", "93"],
  blue: ["34", "94"],
  magenta: ["35", "95"],
  cyan: ["36", "96"],
  white: ["37", "97"],
};

const BASIC_BG: Record<BasicColorName, [BasicBgCode, BasicBrightBg]> = {
  black: ["40", "100"],
  red: ["41", "101"],
  green: ["42", "102"],
  yellow: ["43", "103"],
  blue: ["44", "104"],
  magenta: ["45", "105"],
  cyan: ["46", "106"],
  white: ["47", "107"],
};

function mapPalette(make: (name: ColorName, hex: string) => string): Palette {
  const names = Object.keys(COLOR_HEX) as ColorName[];
  return Object.fromEntries(
    names.map((name) => [name, make(name, COLOR_HEX[name])]),
  ) as Palette;
}

function sgrPrefix(target: ColorTarget): string {
  return `${esc}[${target === "fg" ? 38 : 48}`;
}

function c256Level(value: number): number {
  let best = 0;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (const [index, candidate] of C256_LEVELS.entries()) {
    const distance = Math.abs(candidate - value);
    if (distance < bestDistance) {
      best = index;
      bestDistance = distance;
    }
  }
  return best;
}

function c256Index(r: number, g: number, b: number): number {
  if (Math.max(r, g, b) - Math.min(r, g, b) < 24) {
    const gray = Math.round((r + g + b) / 3);
    if (gray < 5) return 16;
    if (gray > 238) return 231;
    return 232 + Math.round((gray - 8) / 10);
  }
  return 16 + 36 * c256Level(r) + 6 * c256Level(g) + c256Level(b);
}

export function truecolorCode(
  r: number,
  g: number,
  b: number,
  target: ColorTarget,
): string {
  return `${sgrPrefix(target)};2;${r};${g};${b}m`;
}

export function buildTruecolorPalette(target: ColorTarget): Palette {
  return mapPalette((_name, hex) => {
    const { r, g, b } = hexToRgb(hex);
    return truecolorCode(r, g, b, target);
  });
}

export function buildC256Palette(target: ColorTarget): Palette {
  return mapPalette((_name, hex) => {
    const { r, g, b } = hexToRgb(hex);
    return `${sgrPrefix(target)};5;${c256Index(r, g, b)}m`;
  });
}

export function buildBasicPalette(target: ColorTarget): Palette {
  const codes = target === "fg" ? BASIC_FG : BASIC_BG;
  return mapPalette((name) => {
    const alias = BASIC_ALIAS[name];
    return `${esc}[${codes[alias.base][alias.bright ? 1 : 0]}m`;
  });
}

export function buildBrightBackground(): BasicPalette {
  const names = Object.keys(BASIC_BG) as BasicColorName[];
  return Object.fromEntries(
    names.map((name) => [name, `${esc}[${BASIC_BG[name][1]}m`]),
  ) as BasicPalette;
}

export function buildCssPalette(target: ColorTarget): Palette {
  return mapPalette((_name, hex) => {
    const property = target === "fg" ? "color" : "background-color";
    return `${property}: ${hex}`;
  });
}
