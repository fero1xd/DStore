import chalk from "chalk";
import { LogColors } from "./types";

export const logColors: LogColors = {
  ERROR: chalk.red.bold,
  INFO: chalk.blueBright.bold,
  SUCCESS: chalk.green.bold,
  WARN: chalk.yellow.bold,
};
