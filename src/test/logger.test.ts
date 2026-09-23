import {
  Debug,
  Error,
  Group,
  GroupEnd,
  Info,
  Log,
  Success,
  Warn,
  defaultLogger,
} from "../index.ts";
import { Logger } from "../logger.ts";
import { assert, section, summary } from "./helpers.ts";

export function runLoggerTests() {
  section("core log functions");

  // These should not throw
  try {
    const prefixedApiLogger = new Logger({ prefix: "API" });
    prefixedApiLogger.Info("test prefix");
    assert(prefixedApiLogger.prefix === "API", "logger prefix is set");
    const prefixedBackendLogger = new Logger({ prefix: "BACKEND" });
    prefixedBackendLogger.Info("test prefix 2");
    assert(prefixedBackendLogger.prefix === "BACKEND", "logger prefix is set");

    Info("test info");
    Success("test success");
    Warn("test warn");
    Error("test error");
    Debug("test debug");
    Log("test log");
    assert(true, "core log functions executed without throwing");
  } catch (e) {
    assert(false, `core log functions threw: ${e}`);
  }

  section("multiple arguments");
  try {
    Info("user:", "João", "age:", 25);
    assert(true, "multiple arguments accepted");
  } catch (e) {
    assert(false, `multiple arguments threw: ${e}`);
  }

  section("object serialization");
  try {
    Info({ name: "test", nested: { a: 1 } });
    assert(true, "object serialization accepted");
  } catch (e) {
    assert(false, `object serialization threw: ${e}`);
  }

  section("error objects");
  try {
    Error(new globalThis.Error("test error"));
    assert(true, "Error objects accepted");
  } catch (e) {
    assert(false, `Error objects threw: ${e}`);
  }

  section("group indentation");
  try {
    Group("outer");
    Group("inner");
    GroupEnd();
    GroupEnd();
    assert(true, "nested groups accepted");
  } catch (e) {
    assert(false, `nested groups threw: ${e}`);
  }

  section("GroupEnd floor");
  try {
    GroupEnd(); // should not go below 0
    GroupEnd();
    GroupEnd();
    assert(true, "GroupEnd does not throw on underflow");
  } catch (e) {
    assert(false, `GroupEnd underflow threw: ${e}`);
  }

  section("edge cases");
  try {
    Info(null);
    Info(undefined);
    Info(Symbol("test"));
    Info(() => "function");
    assert(true, "edge case values accepted");
  } catch (e) {
    assert(false, `edge cases threw: ${e}`);
  }

  section("Logger with file path");
  try {
    assert(defaultLogger.path === "./logs", "default logger writes to ./logs");
    const logger = new Logger({ path: "./logs/test.log" });
    logger.Info("file test");
    assert(typeof logger.path === "string", "logger.path is set");
  } catch (e) {
    assert(false, `Logger with path threw: ${e}`);
  }

  section("Logger with default path");
  try {
    const logger = new Logger();
    assert(logger.path === "./logs", "logger.path defaults to ./logs");
  } catch (e) {
    assert(false, `Logger with default path threw: ${e}`);
  }

  section("defaultLogger");
  try {
    assert(defaultLogger instanceof Logger, "defaultLogger is a Logger instance");
  } catch (e) {
    assert(false, `defaultLogger check threw: ${e}`);
  }

  summary("logger");
}
