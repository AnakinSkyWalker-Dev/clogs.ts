import { cssFg } from "./colors/css/fg.ts";
import { cssReset } from "./colors/css/index.ts";
import { COLORS } from "./colors/index.ts";
import { getPalette } from "./colors/palette.ts";
import { DEFAULT_LOG_PATH } from "./constants/index.ts";
import type {
  ColorName,
  Environment,
  LoggerOptions,
  LogLevel,
  Palette,
  RuntimeImportMeta,
} from "./types/index.ts";
import { getEnvironment } from "./utils/env.ts";
import { formatDate, stringify, stripAnsi } from "./utils/formatter.ts";

const LEVEL_COLOR: Record<LogLevel, ColorName> = {
  info: "blue",
  ok: "green",
  warn: "yellow",
  error: "red",
  debug: "purple",
  log: "white",
  group: "cyan",
};

const TIMESTAMP_COLOR: ColorName = "gray";
const PREFIX_COLOR: ColorName = "sky";

let cachedPalette: Palette | null = null;
let paletteInit = false;

function resolvedPalette(): Palette | null {
  if (!paletteInit) {
    cachedPalette = getPalette();
    paletteInit = true;
  }
  return cachedPalette;
}

export class Logger {
  #indent = 0;
  path?: string;
  prefix?: string;

  constructor(options?: LoggerOptions) {
    const processLogPath =
      getEnvironment() === "node" ? process.env?.LOG_PATH : undefined;
    const astroLogPath = (import.meta as RuntimeImportMeta).env?.LOG_PATH;

    if (options?.path !== undefined) {
      this.path = options.path;
    } else if (processLogPath) {
      this.path = processLogPath;
    } else if (astroLogPath) {
      this.path = astroLogPath;
    } else {
      this.path = DEFAULT_LOG_PATH;
    }

    if (options?.prefix !== undefined) {
      this.prefix = options.prefix;
    }
  }

  child(options?: LoggerOptions): Logger {
    if (options?.prefix !== undefined) {
      this.prefix = this.prefix
        ? `${this.prefix}:${options.prefix}`
        : options.prefix;
    }
    return this;
  }

  async #writeToFile(env: Environment, line: string) {
    if (env !== "node" || !this.path) return;

    try {
      const { appendFileLog } = await import("./utils/appendFile.ts");
      await appendFileLog(this.path, line);
    } catch {
      // silent — file logging should never crash the app
    }
  }

  #write(level: LogLevel, ...args: unknown[]) {
    const { date, time } = formatDate();
    const indent = this.#indent > 0 ? " ".repeat(this.#indent * 2) : "";
    const message = indent + args.map(stringify).join(" ");
    const prefix = this.prefix ? `[${this.prefix}]` : "";
    const env = getEnvironment();

    const plain = [time, date, level, prefix, message]
      .filter(Boolean)
      .join(" ");

    if (this.path) {
      void this.#writeToFile(env, stripAnsi(plain));
    }

    if (env === "browser") {
      const formats = [`%c${time} ${date}`, `%c${level}`];
      const styles = [cssFg[TIMESTAMP_COLOR], cssFg[LEVEL_COLOR[level]]];

      if (prefix) {
        formats.push(`%c${prefix}`);
        styles.push(cssFg[PREFIX_COLOR]);
      }

      formats.push("%s");
      console.log(formats.join(" "), ...styles, message);
      return;
    }

    const palette = resolvedPalette();

    if (!palette) {
      process.stdout.write(`${plain}\n`);
      return;
    }

    const reset = COLORS.reset;
    const segments = [
      `${palette[TIMESTAMP_COLOR]}${time} ${date}${reset}`,
      `${palette[LEVEL_COLOR[level]]}${level}${reset}`,
    ];

    if (prefix) {
      segments.push(`${palette[PREFIX_COLOR]}${prefix}${reset}`);
    }

    segments.push(message);
    process.stdout.write(`${segments.join(" ")}\n`);
  }

  Info(...args: unknown[]) {
    this.#write("info", ...args);
  }

  Success(...args: unknown[]) {
    this.#write("ok", ...args);
  }

  Warn(...args: unknown[]) {
    this.#write("warn", ...args);
  }

  Error(...args: unknown[]) {
    this.#write("error", ...args);
  }

  Debug(...args: unknown[]) {
    this.#write("debug", ...args);
  }

  Log(...args: unknown[]) {
    this.#write("log", ...args);
  }

  Group(title: string) {
    this.#write("group", title);
    this.#indent++;
  }

  GroupEnd() {
    this.#indent = Math.max(0, this.#indent - 1);
  }
}
