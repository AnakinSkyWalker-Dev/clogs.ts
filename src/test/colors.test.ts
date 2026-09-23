import { gradient, hexToRgb, rgbToAnsi, rgbToAnsiBg } from "../colors/gradient.ts";
import { bg, fg, colorMode, COLORS } from "../colors/index.ts";
import { getPalette } from "../colors/palette.ts";
import { Debug, Error, Info, Log, Success, Warn } from "../index.ts";
import { assert, section, summary } from "./helpers.ts";

export function runColorTests() {
  section("colorMode detection");
  assert(
    colorMode === "truecolor" || colorMode === "256" || colorMode === "basic" || colorMode === false,
    `colorMode is a valid value: ${colorMode}`,
  );

  section("COLORS structure");
  assert(typeof COLORS.reset === "string", "COLORS.reset is a string");
  assert(typeof COLORS.basic === "object", "COLORS.basic is an object");
  assert(typeof COLORS.c256 === "object", "COLORS.c256 is an object");
  assert(typeof COLORS.truecolor === "object", "COLORS.truecolor is an object");
  assert(typeof COLORS.bg === "object", "COLORS.bg is an object");
  assert(typeof COLORS.bg.basic === "object", "COLORS.bg.basic is an object");
  assert(typeof COLORS.bg.c256 === "object", "COLORS.bg.c256 is an object");
  assert(typeof COLORS.bg.truecolor === "object", "COLORS.bg.truecolor is an object");

  // ── All basic foreground colors ──
  section("basic foreground colors");
  const basicColors = [
    "black", "red", "green", "yellow", "blue", "magenta", "cyan", "white",
  ] as const;
  for (const name of basicColors) {
    assert(typeof COLORS.basic[name] === "string", `basic.${name} is a string`);
    Info(`${COLORS.basic[name]}basic.${name}${COLORS.reset}`);
  }

  // ── All c256 foreground colors ──
  section("c256 foreground colors");
  const c256Colors = Object.keys(COLORS.c256) as Array<keyof typeof COLORS.c256>;
  for (const name of c256Colors) {
    assert(typeof COLORS.c256[name] === "string", `c256.${name} is a string`);
    Info(`${COLORS.c256[name]}c256.${name}${COLORS.reset}`);
  }

  // ── All truecolor foreground colors ──
  section("truecolor foreground colors");
  const truecolorColors = Object.keys(COLORS.truecolor) as Array<keyof typeof COLORS.truecolor>;
  for (const name of truecolorColors) {
    assert(typeof COLORS.truecolor[name] === "string", `truecolor.${name} is a string`);
    Info(`${COLORS.truecolor[name]}truecolor.${name}${COLORS.reset}`);
  }
  assert(truecolorColors.length >= 30, `truecolor has ${truecolorColors.length} colors (>= 30)`);

  // ── All basic background colors ──
  section("basic background colors");
  const basicBgColors = Object.keys(COLORS.bg.basic) as Array<keyof typeof COLORS.bg.basic>;
  for (const name of basicBgColors) {
    if (name === "brightBackground") continue;
    assert(typeof COLORS.bg.basic[name] === "string", `bg.basic.${name} is a string`);
  }
  Success(bg("red", " bg.red "));
  Warn(bg("green", " bg.green "));
  Info(bg("blue", " bg.blue "));
  Log(bg("yellow", " bg.yellow "));
  Debug(bg("magenta", " bg.magenta "));
  Info(bg("cyan", " bg.cyan "));

  // ── All c256 background colors ──
  section("c256 background colors");
  const c256BgColors = Object.keys(COLORS.bg.c256) as Array<keyof typeof COLORS.bg.c256>;
  for (const name of c256BgColors) {
    assert(typeof COLORS.bg.c256[name] === "string", `bg.c256.${name} is a string`);
  }
  Info(bg("orange", " bg.orange "));
  Info(bg("pink", " bg.pink "));
  Info(bg("lime", " bg.lime "));
  Info(bg("indigo", " bg.indigo "));
  Info(bg("violet", " bg.violet "));
  Info(bg("teal", " bg.teal "));
  Info(bg("rose", " bg.rose "));
  Info(bg("amber", " bg.amber "));
  Info(bg("emerald", " bg.emerald "));
  Info(bg("sky", " bg.sky "));
  Info(bg("purple", " bg.purple "));
  Info(bg("brown", " bg.brown "));

  // ── All truecolor background colors ──
  section("truecolor background colors");
  const truecolorBgColors = Object.keys(COLORS.bg.truecolor) as Array<
    keyof typeof COLORS.bg.truecolor
  >;
  for (const name of truecolorBgColors) {
    assert(typeof COLORS.bg.truecolor[name] === "string", `bg.truecolor.${name} is a string`);
  }

  // ── Combined fg + bg demo ──
  section("combined fg + bg");
  const fgC = COLORS.truecolor;
  const bgP = COLORS.bg.truecolor;
  Success(`${bgP.red}${fgC.white} white on red ${COLORS.reset}`);
  Info(`${bgP.blue}${fgC.white} white on blue ${COLORS.reset}`);
  Warn(`${bgP.green}${fgC.white} white on green ${COLORS.reset}`);
  Error(`${bgP.magenta}${fgC.white} white on magenta ${COLORS.reset}`);
  Debug(`${bgP.cyan}${fgC.white} white on cyan ${COLORS.reset}`);
  Log(`${bgP.yellow}${fgC.white} white on yellow ${COLORS.reset}`);
  Info(`${bgP.indigo}${fgC.white} white on indigo ${COLORS.reset}`);
  Info(`${bgP.teal}${fgC.white} white on teal ${COLORS.reset}`);
  Info(`${bgP.rose}${fgC.white} white on rose ${COLORS.reset}`);
  Info(`${bgP.orange}${fgC.white} white on orange ${COLORS.reset}`);
  Info(`${bgP.pink}${fgC.white} white on pink ${COLORS.reset}`);
  Info(`${bgP.purple}${fgC.white} white on purple ${COLORS.reset}`);
  Info(`${bgP.emerald}${fgC.white} white on emerald ${COLORS.reset}`);
  Info(`${bgP.amber}${fgC.white} white on amber ${COLORS.reset}`);
  Info(`${bgP.sky}${fgC.white} white on sky ${COLORS.reset}`);
  Info(`${bgP.brown}${fgC.white} white on brown ${COLORS.reset}`);

  // ── bg() helper ──
  section("bg() helper");
  const redBg = bg("red", " alert ");
  assert(typeof redBg === "string", "bg returns a string");
  assert(redBg.includes(" alert "), "bg preserves text content");

  const tealBg = bg("teal", " deep ");
  assert(tealBg.includes(" deep "), "bg works with extended colors");

  const allBgNames = [
    "red", "green", "yellow", "blue", "magenta", "cyan",
    "orange", "pink", "lime", "indigo", "violet", "teal",
    "rose", "amber", "emerald", "sky", "purple", "brown",
  ] as const;
  for (const name of allBgNames) {
    const result = bg(name, ` ${name} `);
    assert(typeof result === "string", `bg("${name}") returns a string`);
    assert(result.includes(` ${name} `), `bg("${name}") preserves text`);
  }

  // ── fg() helper ──
  section("fg() helper");
  const redFg = fg("red", " alert ");
  assert(typeof redFg === "string", "fg returns a string");
  assert(redFg.includes(" alert "), "fg preserves text content");

  const tealFg = fg("teal", " deep ");
  assert(tealFg.includes(" deep "), "fg works with extended colors");

  const allFgNames = [
    "red", "green", "yellow", "blue", "magenta", "cyan",
    "orange", "pink", "lime", "indigo", "violet", "teal",
    "rose", "amber", "emerald", "sky", "purple", "brown",
  ] as const;
  for (const name of allFgNames) {
    const result = fg(name, ` ${name} `);
    assert(typeof result === "string", `fg("${name}") returns a string`);
    assert(result.includes(` ${name} `), `fg("${name}") preserves text`);
  }

  // fg() visual output
  Info(fg("blue", " fg blue "));
  Success(fg("green", " fg green "));
  Warn(fg("yellow", " fg yellow "));
  Error(fg("red", " fg red "));
  Debug(fg("magenta", " fg magenta "));
  Info(fg("cyan", " fg cyan "));
  Info(fg("orange", " fg orange "));
  Info(fg("purple", " fg purple "));

  // ── hexToRgb ──
  section("hexToRgb");
  const red = hexToRgb("#ff0000");
  assert(red.r === 255 && red.g === 0 && red.b === 0, "hexToRgb red");
  const green = hexToRgb("#00ff00");
  assert(green.r === 0 && green.g === 255 && green.b === 0, "hexToRgb green");
  const blue = hexToRgb("#0000ff");
  assert(blue.r === 0 && blue.g === 0 && blue.b === 255, "hexToRgb blue");
  const black = hexToRgb("#000000");
  assert(black.r === 0 && black.g === 0 && black.b === 0, "hexToRgb black");
  const white = hexToRgb("#ffffff");
  assert(white.r === 255 && white.g === 255 && white.b === 255, "hexToRgb white");
  const noHash = hexToRgb("ff8800");
  assert(noHash.r === 255 && noHash.g === 136 && noHash.b === 0, "hexToRgb without #");
  const gray = hexToRgb("#808080");
  assert(gray.r === 128 && gray.g === 128 && gray.b === 128, "hexToRgb gray");
  const nearBlack = hexToRgb("#010101");
  assert(nearBlack.r === 1 && nearBlack.g === 1 && nearBlack.b === 1, "hexToRgb near-black");

  // ── rgbToAnsi ──
  section("rgbToAnsi");
  const ansi = rgbToAnsi(255, 128, 0);
  assert(ansi.startsWith("\x1b["), "rgbToAnsi starts with escape");
  assert(ansi.includes("255"), "rgbToAnsi contains r value");
  assert(ansi.includes("128"), "rgbToAnsi contains g value");
  assert(ansi.includes("0"), "rgbToAnsi contains b value");

  Info(`${rgbToAnsi(255, 0, 0)}red${COLORS.reset}`);
  Info(`${rgbToAnsi(0, 255, 0)}green${COLORS.reset}`);
  Info(`${rgbToAnsi(0, 0, 255)}blue${COLORS.reset}`);
  Info(`${rgbToAnsi(255, 128, 0)}orange${COLORS.reset}`);
  Info(`${rgbToAnsi(128, 0, 255)}purple${COLORS.reset}`);

  // ── rgbToAnsiBg ──
  section("rgbToAnsiBg");
  const bgAnsi = rgbToAnsiBg(100, 200, 50);
  assert(bgAnsi.startsWith("\x1b["), "rgbToAnsiBg starts with escape");
  assert(bgAnsi.includes("48;2;"), "rgbToAnsiBg uses bg escape code (48;2;)");

  Info(`${rgbToAnsiBg(255, 0, 0)}rgb bg red${COLORS.reset}`);
  Info(`${rgbToAnsiBg(0, 255, 0)}rgb bg green${COLORS.reset}`);
  Info(`${rgbToAnsiBg(0, 0, 255)}rgb bg blue${COLORS.reset}`);
  Info(`${rgbToAnsiBg(255, 128, 0)}rgb bg orange${COLORS.reset}`);

  // ── gradient ──
  section("gradient");
  const g = gradient("Hi", "#000000", "#ffffff");
  assert(typeof g === "string", "gradient returns a string");
  assert(g.length > 2, "gradient output is longer than input (has ANSI codes)");
  assert(g.includes("\x1b["), "gradient contains ANSI escape codes");

  const single = gradient("A", "#000000", "#ffffff");
  assert(typeof single === "string", "gradient with single char works");

  const same = gradient("test", "#ff0000", "#ff0000");
  assert(typeof same === "string", "gradient with same colors works");

  const empty = gradient("", "#ff0000", "#0000ff");
  assert(typeof empty === "string", "gradient with empty string works");

  const long = gradient("The quick brown fox jumps over the lazy dog", "#ff0000", "#0000ff");
  assert(typeof long === "string", "gradient with long text works");

  // Invalid hex — should still return a string (NaN rgb values produce weird ANSI but don't throw)
  const invalidHex = gradient("test", "#zzzzzz", "#000000");
  assert(typeof invalidHex === "string", "gradient with invalid hex does not throw");

  Info(gradient("Rainbow", "#ff0000", "#0000ff"));
  Info(gradient("Sunset", "#ff6b35", "#f7c59f"));
  Info(gradient("Neon", "#ff00ff", "#00ffff"));
  Info(gradient("Forest", "#228b22", "#90ee90"));
  Info(gradient("Ocean", "#000080", "#00bfff"));
  Info(gradient("Fire", "#ff4500", "#ffd700"));
  Info(gradient("Purple Haze", "#8b00ff", "#ff69b4"));
  Info(gradient("Midnight", "#191970", "#4169e1"));

  // ── getPalette ──
  section("getPalette");
  const palette = getPalette();
  if (colorMode === false) {
    assert(palette === null, "getPalette returns null when no color");
  } else {
    assert(palette !== null, "getPalette returns palette when color supported");
    if (palette) {
      assert(typeof palette.red === "string", "palette.red is a string");
      assert(typeof palette.blue === "string", "palette.blue is a string");
      assert(typeof palette.green === "string", "palette.green is a string");
      assert(typeof palette.yellow === "string", "palette.yellow is a string");
      assert(typeof palette.white === "string", "palette.white is a string");
    }
  }

  if (palette) {
    section("palette log output");
    Info(`${palette.blue}palette blue text${COLORS.reset}`);
    Success(`${palette.green}palette green text${COLORS.reset}`);
    Warn(`${palette.yellow}palette yellow text${COLORS.reset}`);
    Error(`${palette.red}palette red text${COLORS.reset}`);
    Debug(`${palette.magenta}palette magenta text${COLORS.reset}`);
    Log(`${palette.white}palette white text${COLORS.reset}`);
  }

  summary("colors");
}
