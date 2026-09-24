import { Logger } from "./logger.ts";

// ── Logger ──
export { Logger } from "./logger.ts";

// ── Colors ──
export {
  gradient,
  hexToRgb,
  rgbToAnsi,
  rgbToAnsiBg,
} from "./colors/gradient.ts";
export { bg, colorMode, COLORS, fg } from "./colors/index.ts";
export { getBgPalette, getPalette } from "./colors/palette.ts";
export { cssBg, cssFg, cssReset } from "./colors/css/index.ts";

// ── Environment ──
export { getEnvironment, setEnvironment } from "./utils/env.ts";

// ── Types ──
export type {
  BasicColorName,
  ColorMode,
  ColorName,
  Environment,
  ExtendedColorName,
  LoggerOptions,
  LogLevel,
  Palette,
} from "./types/index.ts";

// ── Default logger ──
export const defaultLogger = new Logger();

export const Log = defaultLogger.Log.bind(defaultLogger);
export const Info = defaultLogger.Info.bind(defaultLogger);
export const Warn = defaultLogger.Warn.bind(defaultLogger);
export const Group = defaultLogger.Group.bind(defaultLogger);
export const Debug = defaultLogger.Debug.bind(defaultLogger);
export const Error = defaultLogger.Error.bind(defaultLogger);
export const Success = defaultLogger.Success.bind(defaultLogger);
export const GroupEnd = defaultLogger.GroupEnd.bind(defaultLogger);
