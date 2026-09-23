import { Error, Log } from "../index.ts";

let passed = 0;
let failed = 0;

export function assert(condition: boolean, msg: string) {
  if (condition) {
    passed++;
  } else {
    failed++;
    Error(`FAIL: ${msg}`);
  }
}

export function section(name: string) {
  Log(`── ${name} ──`);
}

export function summary(label: string) {
  Log(`${label}: ${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
  passed = 0;
  failed = 0;
}
