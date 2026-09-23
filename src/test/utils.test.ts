import { Debug, Info, Log, Success, Warn } from "../index.ts";
import { getEnvironment, setEnvironment } from "../utils/env.ts";
import { formatDate, stringify } from "../utils/formatter.ts";
import { assert, section, summary } from "./helpers.ts";

export function runUtilsTests() {
  section("formatDate");
  const { date, time } = formatDate();
  assert(/^\d{2}\/\d{2}\/\d{4}$/.test(date), `date format is DD/MM/YYYY: "${date}"`);
  assert(/^\d{2}:\d{2}:\d{2}$/.test(time), `time format is HH:MM:SS: "${time}"`);

  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = String(now.getFullYear());
  assert(date === `${day}/${month}/${year}`, `date matches today: ${date}`);

  Info(`formatDate → date: ${date}, time: ${time}`);

  section("stringify - primitives");
  assert(stringify("hello") === "hello", "stringify string passthrough");
  assert(stringify(42) === "42", "stringify number");
  assert(stringify(true) === "true", "stringify boolean");
  assert(stringify(null) === "null", "stringify null");
  assert(stringify(undefined) === "undefined", "stringify undefined");

  Log(`stringify("hello") → "${stringify("hello")}"`);
  Log(`stringify(42) → "${stringify(42)}"`);
  Log(`stringify(true) → "${stringify(true)}"`);
  Log(`stringify(null) → "${stringify(null)}"`);

  section("stringify - objects");
  const objStr = stringify({ a: 1, b: "two" });
  assert(objStr.includes('"a": 1'), "stringify object contains key-value");
  assert(objStr.includes('"b": "two"'), "stringify object contains string value");

  const arrStr = stringify([1, 2, 3]);
  assert(arrStr.includes("1"), "stringify array contains elements");

  Info(`stringify({a:1,b:"two"}) → ${stringify({ a: 1, b: "two" })}`);
  Info(`stringify([1,2,3]) → ${stringify([1, 2, 3])}`);

  section("stringify - errors");
  const err = new globalThis.Error("test error");
  const errStr = stringify(err);
  assert(errStr.includes("test error"), "stringify Error contains message");
  Warn(`stringify(Error) → ${errStr.split("\n")[0]}`);

  section("stringify - circular objects");
  const circular: Record<string, unknown> = {};
  circular.self = circular;
  const circStr = stringify(circular);
  assert(circStr.includes("[Circular Object]"), "stringify handles circular references");
  Debug(`stringify(circular) → "${circStr}"`);

  section("stringify - symbols and functions");
  assert(stringify(Symbol("test")) === "Symbol(test)", "stringify Symbol");
  assert(stringify(() => "hi") === '() => "hi"', "stringify function");
  Log(`stringify(Symbol) → "${stringify(Symbol("test"))}"`);

  section("stringify - typed objects");
  const dateStr = stringify(new Date("2025-01-15"));
  assert(dateStr.includes("2025"), "stringify Date contains year");
  assert(dateStr.includes("01"), "stringify Date contains month");

  // Map, Set, RegExp serialize as {} via JSON.stringify (intentional — no special handling)
  const mapStr = stringify(new Map([["a", 1]]));
  assert(mapStr === "{}", "stringify Map serializes as empty object");

  const setStr = stringify(new Set([1, 2, 3]));
  assert(setStr === "{}", "stringify Set serializes as empty object");

  const regexStr = stringify(/hello/gi);
  assert(regexStr === "{}", "stringify RegExp serializes as empty object");

  section("getEnvironment / setEnvironment");
  const original = getEnvironment();
  assert(original === "node" || original === "browser", `getEnvironment returns valid value: ${original}`);
  Info(`getEnvironment() → "${original}"`);

  setEnvironment("node");
  assert(getEnvironment() === "node", "setEnvironment to node");
  Success(`setEnvironment("node") → getEnvironment() = "${getEnvironment()}"`);

  setEnvironment("browser");
  assert(getEnvironment() === "browser", "setEnvironment to browser");
  Warn(`setEnvironment("browser") → getEnvironment() = "${getEnvironment()}"`);

  setEnvironment(original);

  summary("utils");
}
