import { Command, Option } from "commander";
import { checkExists } from "./utils";
import { createLogger } from "./logger";

export const getOptions = async () => {
  const logger = createLogger("cli");
  const program = new Command()
    .name("dstore")
    .description("CLI for uploading and downloading files")
    .addOption(
      new Option("-u, --upload <file>", "Path to the file to upload").conflicts(
        "download",
      ),
    )
    .addOption(new Option("-d, --download <id>", "Id of the file to download"))
    .addOption(
      new Option(
        "-p, --path [dir]>",
        "Directory to save the file in",
      ).conflicts("upload"),
    )

    .addOption(
      new Option(
        "-w, --web",
        "Wether to enable downloading of files from the webserver",
      ),
    )
    .parse(process.argv);

  const opts = program.opts();

  if (!opts.upload && !opts.download && !opts.web) {
    logger.error("Provide atleast one action");
    return null;
  }

  if (opts.upload) {
    if (
      !(await checkExists({
        filename: opts.upload,
        readPerm: true,
        isDir: false,
      }))
    ) {
      return null;
    }
    return {
      upload: opts.upload as string,
      server: opts.web as undefined | boolean,
    };
  }

  if (opts.download) {
    if (!opts.path) {
      logger.error("Provide a directory path '--path [dir]'");
      return null;
    }

    if (
      !(await checkExists({
        filename: opts.path === "." ? process.cwd() : opts.path,
        isDir: true,
        readPerm: false,
      }))
    ) {
      return null;
    }

    return {
      download: opts.download as string,
      server: opts.web as undefined | boolean,
      path: opts.path as string,
    };
  }

  return {
    server: opts.web as undefined | boolean,
  };
};
