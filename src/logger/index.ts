import { LoggerOptions, LoggerType } from "./types";
import { logColors } from "./colors";
import { calculateGaps } from "./gaps";
import { parseCurrentTime } from "./time";

export const createLogger = (...args: LoggerOptions): LoggerType => {
  const name = args[0] ?? "main";

  return {
    log(type, message) {
      console.log(
        logColors[type](
          `${parseCurrentTime()}    ${calculateGaps(
            `[${type}]`,
          )}${name} - ${message}`,
        ),
      );
    },
    info(message) {
      this.log("INFO", message);
    },
    success(message) {
      this.log("SUCCESS", message);
    },
    error(message) {
      this.log("ERROR", message);
    },
    warn(message) {
      this.log("WARN", message);
    },
  };
};
