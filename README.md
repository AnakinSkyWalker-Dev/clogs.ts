# c.logs

Small TypeScript library for colored terminal logging and gradient text. No build step — ships raw `.ts` files consumed directly via ESM.

## Install

```bash
pnpm add clogs.ts
```

Requires `moduleResolution: "bundler"` or `"node16"` in the consuming project.

## Usage

```ts
import { Info, Warn, Error, Log, Success, Debug } from "clogs.ts";

Info("servidor rodando");
Warn("atenção");
Error("falha");
Log("genérico");
Success("tudo certo");
Debug("debug:", obj);
```

### Grouping

```ts
import { Group, GroupEnd } from "clogs.ts";

Group("Inicialização");
Info("carregando...");
GroupEnd();
```

### Colors and backgrounds

```ts
import { fg, bg, COLORS } from "clogs.ts";

// Foreground color
console.log(fg("orange", "orange text"));
console.log(fg("blue", "blue text"));

// Background color
console.log(bg("red", " alert "));
console.log(bg("indigo", " deep "));

// Direct access to palette
const c = COLORS.truecolor;
console.log(`${c.orange}orange text${COLORS.reset}`);
```

### Gradient text

```ts
import { gradient } from "clogs.ts";

console.log(gradient("Hello", "#00ffcc", "#3366ff"));
```

### Custom logger with file output

```ts
import { Logger } from "clogs.ts";

const logger = new Logger({ path: "./logs/app.log", prefix: "api" });

logger.Info("salvo em arquivo");
logger.Error("erro persistente");
```

Every log call writes a plain-text line (no ANSI codes) to the configured path in addition to the terminal output. Lines use the format `HH:mm:ss DD/MM/YYYY [prefix] level message`. The prefix is optional and is configured with `new Logger({ prefix: "api" })`. By default, logs are written to `./logs/YYYY-MM-DD.log`; the directory and file are created automatically. Set `LOG_PATH` or pass `path` to override the default. In Astro, `LOG_PATH` is also read from `import.meta.env`; file logging must run in server/SSR code, not in browser code.

### Using as a default logger

```ts
import { defaultLogger } from "clogs.ts";

// The default is already ./logs/YYYY-MM-DD.log.
defaultLogger.Info("agora salva em arquivo");

// Add a prefix to subsequent messages:
defaultLogger.prefix = "api";

// Override it when needed:
defaultLogger.path = "./logs/app.log";
```

### Browser support (devtools)

```ts
import { setEnvironment, Info } from "clogs.ts";

// Force browser mode — colors via CSS in devtools
setEnvironment("browser");
Info("styled in devtools");

// Force node mode — ANSI colors in terminal
setEnvironment("node");
Info("styled in terminal");
```

By default, the library auto-detects the environment (Node.js vs browser).

## API

All log functions are standalone exports — no class needed:

| Export             | Color                    |
| ------------------ | ------------------------ |
| `Info(...args)`    | blue                     |
| `Success(...args)` | green                    |
| `Warn(...args)`    | yellow                   |
| `Error(...args)`   | red                      |
| `Debug(...args)`   | magenta                  |
| `Log(...args)`     | white                    |
| `Group(title)`     | cyan (increments indent) |
| `GroupEnd()`       | (decrements indent)      |

### Utilities

| Export                       | Description                                                              |
| ---------------------------- | ------------------------------------------------------------------------ |
| `fg(color, text)`            | Wraps text with foreground color (auto-detects color mode)               |
| `bg(color, text)`            | Wraps text with background color (auto-detects color mode)               |
| `COLORS`                     | ANSI escape codes organized by color mode (`basic`, `c256`, `truecolor`) |
| `gradient(text, start, end)` | Renders text as a gradient between two hex colors                        |
| `hexToRgb(hex)`              | Converts `#rrggbb` to `{ r, g, b }`                                      |
| `rgbToAnsi(r, g, b)`         | Converts RGB to ANSI truecolor foreground escape                         |
| `rgbToAnsiBg(r, g, b)`       | Converts RGB to ANSI truecolor background escape                         |
| `getPalette()`               | Returns the active foreground palette (or `null` if no color support)    |
| `getBgPalette()`             | Returns the active background palette (or `null` if no color support)    |
| `colorMode`                  | Detected color mode: `"truecolor"`, `"256"`, `"basic"`, or `false`       |
| `getEnvironment()`           | Returns current environment: `"node"` or `"browser"`                     |
| `setEnvironment(env)`        | Override environment detection                                           |

## Color modes

The library auto-detects terminal color support via `COLORTERM`, `TERM`, and `NO_COLOR` environment variables. Falls back gracefully through truecolor → 256 → basic → no color.

## License

ISC
