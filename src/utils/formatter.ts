import { ANSI_REGEX } from "../constants/index.ts";

export function stripAnsi(text: string): string {
  return text.replace(ANSI_REGEX, "");
}

export function formatDate() {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");

  return {
    date: `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`,
    time: `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`,
  };
}

export function stringify(value: unknown): string {
  if (typeof value === "string") return value;
  if (value instanceof Error) return value.stack ?? value.message;

  if (typeof value === "object" && value !== null) {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return "[Circular Object]";
    }
  }

  return String(value);
}
