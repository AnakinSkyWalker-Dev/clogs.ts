import esc from "./escape.ts";

export function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);

  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgbToAnsiCode(r: number, g: number, b: number, mode: "fg" | "bg") {
  const code = mode === "fg" ? 38 : 48;
  return `${esc}[${code};2;${r};${g};${b}m`;
}

export function rgbToAnsi(r: number, g: number, b: number) {
  return rgbToAnsiCode(r, g, b, "fg");
}

export function rgbToAnsiBg(r: number, g: number, b: number) {
  return rgbToAnsiCode(r, g, b, "bg");
}

export function gradient(text: string, start: string, end: string) {
  const startRGB = hexToRgb(start);
  const endRGB = hexToRgb(end);

  const chars = [...text];
  const len = chars.length;

  return (
    chars
      .map((char, i) => {
        const ratio = i / Math.max(len - 1, 1);

        const r = Math.round(startRGB.r + (endRGB.r - startRGB.r) * ratio);
        const g = Math.round(startRGB.g + (endRGB.g - startRGB.g) * ratio);
        const b = Math.round(startRGB.b + (endRGB.b - startRGB.b) * ratio);

        return `${rgbToAnsi(r, g, b)}${char}`;
      })
      .join("") + `${esc}[0m`
  );
}
