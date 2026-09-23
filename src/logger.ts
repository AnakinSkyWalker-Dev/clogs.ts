import { cssFg } from "./colors/css/fg.ts";
import { cssReset } from "./colors/css/index.ts";
import { COLORS } from "./colors/index.ts";
import { getPalette } from "./colors/palette.ts";
import type { LoggerOptions, Palette, RuntimeImportMeta } from "./types/index.ts";
import { getEnvironment } from "./utils/env.ts";
import { formatDate, stringify } from "./utils/formatter.ts";

const ANSI_REGEX = /\x1b\[[0-9;]*m/g;
const DEFAULT_LOG_PATH = "./logs";

function stripAnsi(text: string): string {
  return text.replace(ANSI_REGEX, "");
}

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
      typeof process !== "undefined" ? process.env?.LOG_PATH : undefined;
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

  async #writeToFile(env: string, line: string) {
    if (env !== "node" || !this.path) return;

    try {
      const { appendFileLog } = await import("./utils/appendFile.ts")
      await appendFileLog(this.path, line);
    } catch {
      // silent — file logging should never crash the app
    }
  }

  #formatMessage(level: string, color: keyof Palette, ...args: unknown[]) {
    const { date, time } = formatDate();
    const indent = this.#indent > 0 ? " ".repeat(this.#indent * 2) : "";
    const message = indent + args.map(stringify).join(" ");
    return { date, time, level, color, message };
  }

  #writeBrowser(
    date: string,
    time: string,
    level: string,
    color: keyof Palette,
    message: string,
  ) {
    const prefix = this.prefix ? `[${this.prefix}] ` : "";

    console.log(
      `%c${time} %c${date} %c${prefix}%c${level} %c${message}`,
      cssFg.gray,
      cssFg.gray,
      cssFg.orange,
      cssFg[color],
      cssReset,
    );
  }

  #writeTerminal(
    date: string,
    time: string,
    level: string,
    color: keyof Palette,
    message: string,
  ) {
    const palette = resolvedPalette();
    const prefix = this.prefix ? `[${this.prefix}] ` : "";
    const line = `${time} ${date} ${prefix}${level} ${message}`;

    if (!palette) {
      process.stdout.write(line + "\n");
      return;
    }

    process.stdout.write(
        `${palette.gray}${time}${COLORS.reset} ` +
        `${palette.gray}${date}${COLORS.reset} ` +
        `${this.prefix ? `${palette.lime}[${this.prefix}]${COLORS.reset} ` : ""}` +
        `${palette[color]}${level}${COLORS.reset} ` +
        `${palette.white}${message}${COLORS.reset}\n`,
    );
  }

  #write(level: string, color: keyof Palette, ...args: unknown[]) {
    const {
      date,
      time,
      level: lvl,
      color: c,
      message,
    } = this.#formatMessage(level, color, ...args);

    const env = getEnvironment();

    if (this.path) {
      const fileMessage = stripAnsi(message);
      const prefix = this.prefix ? `[${this.prefix}] ` : "";
      const fileLine = `${time} ${date} ${prefix}${lvl} ${fileMessage}`;
      void this.#writeToFile(env, fileLine);
    }

    if (env === "browser") {
      this.#writeBrowser(date, time, lvl, c, message);
    } else {
      this.#writeTerminal(date, time, lvl, c, message);
    }
  }

  Info(...args: unknown[]) {
    this.#write("info", "blue", ...args);
  }

  Success(...args: unknown[]) {
    this.#write("ok", "green", ...args);
  }

  Warn(...args: unknown[]) {
    this.#write("warn", "yellow", ...args);
  }

  Error(...args: unknown[]) {
    this.#write("error", "red", ...args);
  }

  Debug(...args: unknown[]) {
    this.#write("debug", "purple", ...args);
  }

  Log(...args: unknown[]) {
    this.#write("log", "white", ...args);
  }

  Group(title: string) {
    this.#write("group", "cyan", title);
    this.#indent++;
  }

  GroupEnd() {
    this.#indent = Math.max(0, this.#indent - 1);
  }
}
