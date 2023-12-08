import { logTypesConst } from "./types";

export const longestLogType =
  logTypesConst.reduce((a, b) => (a.length > b.length ? a : b)).length + 2;

export const calculateGaps = (str: string) => {
  let gaps = "  "; // Default 3;

  const gapsToAdd = longestLogType - str.length;

  for (let i = 0; i < gapsToAdd; i++) {
    gaps += " ";
  }

  return `${str}${gaps}`;
};
