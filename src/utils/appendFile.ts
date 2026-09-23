import { appendFile, mkdir } from "node:fs/promises";
import { dirname, extname, join } from "node:path";
import { formatDate } from "./formatter.ts";

async function resolveFilePath(path: string) {
  if (extname(path)) {
    await mkdir(dirname(path), { recursive: true });
    return path;
  }

  await mkdir(path, { recursive: true });

  const { date } = formatDate();
  return join(path, `${date.replaceAll("/", "-")}.log`);
}

export async function appendFileLog(path: string, text: string) {
  const defaultLogFileName = await resolveFilePath(path);
  await appendFile(defaultLogFileName, `${text}\n`, "utf8");
  return defaultLogFileName;
}
