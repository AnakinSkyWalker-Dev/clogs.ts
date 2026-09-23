export type LoggerOptions = {
  path?: string;
  prefix?: string;
};

export type Environment = "node" | "browser";

export type RuntimeImportMeta = ImportMeta & {
  env?: {
    LOG_PATH?: string;
  };
};