import type { BasicBgPalette } from "../../types/index.ts";
import { buildBasicPalette, buildBrightBackground } from "../build.ts";

export const basicBg: BasicBgPalette = {
  ...buildBasicPalette("bg"),
  brightBackground: buildBrightBackground(),
};
