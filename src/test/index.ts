import { Log } from "../index.ts";
import { runColorTests } from "./colors.test.ts";
import { runLoggerTests } from "./logger.test.ts";
import { runUtilsTests } from "./utils.test.ts";

Log("=== clogs.ts test suite ===\n");

runLoggerTests();
runColorTests();
runUtilsTests();

Log("\n=== all tests passed ===");
