import type { Environment } from "../types/index.ts";

let detectedEnv: Environment | null = null;

export function getEnvironment(): Environment {
  if (detectedEnv) return detectedEnv;

  if (typeof process !== "undefined" && process.versions?.node) {
    detectedEnv = "node";
  } else {
    detectedEnv = "browser";
  }

  return detectedEnv;
}

export function setEnvironment(env: Environment) {
  detectedEnv = env;
}
