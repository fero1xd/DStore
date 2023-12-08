import { Chalk } from "chalk";

type Prettify<T extends Record<string, any>> = {
  [K in keyof T]: T[K];
} & {};

export type LoggerType = Prettify<
  {
    [T in Lowercase<LogType>]: (message: string) => void;
  } & {
    log: (type: LogType, message: string) => void;
  }
>;

export const logTypesConst = ["ERROR", "INFO", "SUCCESS", "WARN"] as const;
export type LogType = (typeof logTypesConst)[number];

export type LogColors = Record<LogType, Chalk>;

export type LoggerOptions = [name: string] | [];
