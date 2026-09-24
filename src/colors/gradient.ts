import { truecolorCode } from "./build.ts";
import esc from "./escape.ts";
import { hexToRgb } from "./hex.ts";

export { hexToRgb };

export function rgbToAnsi(r: number, g: number, b: number) {
  return truecolorCode(r, g, b, "fg");
}

export function rgbToAnsiBg(r: number, g: number, b: number) {
  return truecolorCode(r, g, b, "bg");
}

function lerp(from: number, to: number, ratio: number): number {
  return Math.round(from + (to - from) * ratio);
}

export function gradient(text: string, start: string, end: string) {
  const startRgb = hexToRgb(start);
  const endRgb = hexToRgb(end);
  const chars = [...text];

  return (
    chars
      .map((char, i) => {
        const ratio = i / Math.max(chars.length - 1, 1);
        const code = truecolorCode(
          lerp(startRgb.r, endRgb.r, ratio),
          lerp(startRgb.g, endRgb.g, ratio),
          lerp(startRgb.b, endRgb.b, ratio),
          "fg",
        );
        return `${code}${char}`;
      })
      .join("") + `${esc}[0m`
  );
}
