import type { Palette } from "../../types/index.ts";
import { buildTruecolorPalette } from "../build.ts";

export const truecolor: Palette = buildTruecolorPalette("fg");
