import fs from "fs";

type CheckExistsOptions = {
  isDir: boolean;
  readPerm: boolean;
  filename: string;
};

export const checkExists = async ({
  filename,
  readPerm,
  isDir,
}: CheckExistsOptions) => {
  try {
    const stats = fs.statSync(filename);

    if (isDir && stats.isFile()) {
      console.error("Provided a file not a directory");
      return false;
    }

    if (!isDir && stats.isDirectory()) {
      console.error("Provided a directory not a file");
      return false;
    }

    fs.accessSync(filename, readPerm ? fs.constants.R_OK : fs.constants.W_OK);

    return true;
  } catch (err) {
    // console.error(err);
    console.log(`Cannot read ${isDir ? "directory" : "file"}`);
  }

  return false;
};
