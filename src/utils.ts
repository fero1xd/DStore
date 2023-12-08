import fs from "fs";
import { createLogger } from "./logger";

type CheckExistsOptions = {
  isDir: boolean;
  readPerm: boolean;
  filename: string;
};

const logger = createLogger("utils");

export const checkExists = async ({
  filename,
  readPerm,
  isDir,
}: CheckExistsOptions) => {
  try {
    const stats = fs.statSync(filename);

    if (isDir && stats.isFile()) {
      logger.error("Provided a file not a directory");
      return false;
    }

    if (!isDir && stats.isDirectory()) {
      logger.error("Provided a directory not a file");
      return false;
    }

    fs.accessSync(filename, readPerm ? fs.constants.R_OK : fs.constants.W_OK);

    return true;
  } catch (err) {
    // console.error(err);
    logger.error(`Cannot read ${isDir ? "directory" : "file"}`);
  }

  return false;
};
