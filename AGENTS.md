# AGENTS.md

## Repository purpose

`clogs.ts` is a small TypeScript library for colored terminal logging, browser
DevTools styling, and gradient text. It has no build step: the package ships raw
`.ts` files through ESM exports from `src/index.ts`.

## Toolchain

- Runtime: Node.js 24.1
- Package manager: pnpm 12.5.1
- TypeScript configuration: `tsconfig.json`
- Formatting: Prettier 3 with its default configuration

Use `pnpm` for package commands. Do not substitute npm or Yarn unless the user
explicitly asks for it.

## Commands

### Install dependencies

```bash
pnpm install
```

### Run all tests

```bash
pnpm test
```

The test command runs `node ./src/test/index.ts`. Tests use a small, local
assertion runner; there is no Jest, Vitest, or other test framework.

### Run one test module

Test files export runner functions and do not execute when imported directly.
Use Node's dynamic import and call the desired runner:

```bash
node --input-type=module -e "import('./src/test/logger.test.ts').then(({ runLoggerTests }) => runLoggerTests())"
node --input-type=module -e "import('./src/test/colors.test.ts').then(({ runColorTests }) => runColorTests())"
node --input-type=module -e "import('./src/test/utils.test.ts').then(({ runUtilsTests }) => runUtilsTests())"
```

The equivalent all-suite invocation is:

```bash
node --input-type=module -e "import('./src/test/index.ts').then(({ runLoggerTests, runColorTests, runUtilsTests }) => { runLoggerTests(); runColorTests(); runUtilsTests(); })"
```

### Format

```bash
pnpm format
```

`pnpm format` runs `prettier --write .`. To check formatting without changing
files:

```bash
pnpm exec prettier --check .
```

### Type check

```bash
pnpm exec tsc --noEmit
```

TypeScript is not declared in `package.json`, so install or provide it before
using this command in a fresh environment. The current source has two stale
imports in `src/colors/css/fg.ts:1` and `src/colors/css/bg.ts:1` (`../../types.ts`
does not exist); fix those imports before treating a type-check run as green.

### Lint and build

There is no lint configuration, ESLint dependency, lint script, build script, or
compiled output in this repository. Do not claim that lint or build passes. If a
change adds linting or compilation, add the configuration, dependencies, and
package scripts explicitly.

## Project layout

```text
src/
  index.ts              Public ESM barrel and default logger
  logger.ts             Logger class, environment-aware output, file logging
  types/
    index.ts            Public color, palette, environment, and logger types
    logger.ts           LoggerOptions, Environment, RuntimeImportMeta
  colors/
    index.ts            Color detection, fg(), bg(), COLORS
    escape.ts           ANSI escape prefix
    palette.ts          Foreground/background palette resolution
    gradient.ts         Hex-to-RGB and ANSI gradient helpers
    css/
      index.ts          Browser CSS reset
      fg.ts             Browser foreground CSS colors
      bg.ts             Browser background CSS colors
    foreground/
      basic.ts          Basic ANSI foreground palette
      c256.ts           256-color ANSI foreground palette
      truecolor.ts      Truecolor ANSI foreground palette
    background/
      basic.ts          Basic ANSI background palette
      c256.ts           256-color ANSI background palette
      truecolor.ts      Truecolor ANSI background palette
  utils/
    env.ts              Environment detection and test override
    formatter.ts        Date formatting and value serialization
    appendFile.ts       Node-only plain-text log file writer
  test/
    index.ts            Runs all test suites
    helpers.ts          assert(), section(), summary()
    logger.test.ts      Logger and public logging API tests
    colors.test.ts      Color, gradient, and palette tests
    utils.test.ts       Formatter and environment tests
```

## Source conventions

### Imports and modules

- Use ESM and explicit `.ts` extensions on all relative imports.
- Use `import type { ... }` for type-only imports.
- Use the `node:` prefix for Node built-ins.
- Keep type-only imports separate from value imports.
- Import public API from `src/index.ts`; internal modules may import directly.
- Keep the public barrel small and intentional. Export types from
  `src/types/index.ts`.

### Formatting

- Follow Prettier defaults: two-space indentation, double quotes, semicolons,
  and trailing commas where Prettier adds them.
- Keep lines readable; let Prettier wrap long expressions and call chains.
- Do not add formatting configuration unless the project intentionally adopts
  one.

### Naming

- Use `camelCase` for functions, variables, parameters, and private members.
- Use `PascalCase` for classes, interfaces, type aliases, and public logger
  methods such as `Info`, `Success`, and `Group`.
- Use `SCREAMING_SNAKE_CASE` for module-level constants such as `COLORS`,
  `ANSI_REGEX`, and `DEFAULT_LOG_PATH`.
- Name test entry functions `run<Area>Tests()` and keep them exported from test
  modules.
- Preserve the existing public API and method capitalization for compatibility.

### Types

- Keep `strict`, `noUncheckedIndexedAccess`, and `exactOptionalPropertyTypes`
  enabled.
- Handle indexed values as `T | undefined`; do not assume an array element or
  record lookup exists.
- Use `?: T` for optional properties, not `?: T | undefined`.
- Use `as const` for fixed color-name tuples and other literal collections.
- Prefer narrow unions for runtime states such as `"node" | "browser"` and
  `"truecolor" | "256" | "basic" | false`.
- Use `unknown` for public log arguments and validate or serialize them before
  using them as strings.
- Add explicit return types to new public functions when the return shape is
  part of the API; follow existing local-helper inference for trivial helpers.

### Code structure

- Keep modules focused: color data, rendering, environment detection,
  formatting, and file I/O belong in separate files.
- Reuse small helpers instead of duplicating palette or serialization logic.
- Use private class fields for internal logger state such as indentation and
  cached palettes.
- Keep browser and Node behavior behind the detected environment.
- Do not import `src/utils/appendFile.ts` from browser-facing code.

## Error handling

- Handle `null` and `undefined` explicitly at every public boundary.
- Keep file logging best-effort and silent: a failed write must not crash or
  interrupt terminal output.
- Use `try/catch` around serialization and asynchronous file operations.
- Tests use `process.exit(1)` through `summary()` when assertions fail.
- Do not swallow errors in core rendering or color conversion unless the
  existing API explicitly defines a fallback.
- Because `Error` is a public logger export, tests that need the global
  constructor must use `globalThis.Error`.

## Test conventions

- Put assertions in `src/test/*test.ts` and register suites in
  `src/test/index.ts`.
- Use `assert(condition, message)` from `src/test/helpers.ts`.
- Keep tests deterministic and avoid global mutable state where possible.
- Restore environment overrides after tests that change them.
- Remember that logger tests write to `./logs`; test output and log files are
  expected side effects.
- Run the complete suite after any public API, color, environment, or file
  logging change.

## Runtime behavior

- Node mode writes ANSI escapes to `process.stdout`.
- Browser mode uses console `%c` formatting and CSS color strings.
- Color detection considers `NO_COLOR`, `COLORTERM`, `TERM`, and stdout TTY
  status.
- File logging is enabled by `LOG_PATH` or `LoggerOptions.path`.
- File output is plain text with ANSI escapes removed and uses
  `HH:mm:ss DD/MM/YYYY [prefix] level message`.
- Browser styling is intended for DevTools, not arbitrary browser consoles.

## External agent rules

No `.cursor/rules/`, `.cursorrules`, or `.github/copilot-instructions.md` files
exist in this repository. This `AGENTS.md` is the complete repository guidance
for coding agents.

## Before finishing a change

- Run the relevant single-module test command.
- Run `pnpm test`.
- Run `pnpm exec prettier --check .`.
- Run `pnpm exec tsc --noEmit` after resolving the known stale CSS imports.
- Do not add build or lint claims unless their configuration and scripts exist.
- Keep generated logs and dependency directories out of commits.
