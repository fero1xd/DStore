import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";
import { handleEvents } from "./handler";
import { getOptions } from "./cli";
import { getFile } from "./database/ops";
import { createLogger } from "./logger";
import { env } from "./env";

export const main = async () => {
  const options = await getOptions();
  const logger = createLogger();

  if (options === null) {
    process.exit(-1);
  }

  if (options.download && !(await getFile(options.download))) {
    logger.error("File not found");
    process.exit(-1);
  }

  const client = new Client({
    intents: [GatewayIntentBits.Guilds],
  });

  handleEvents({
    client,
    download: options?.download,
    upload: options?.upload,
    server: options?.server,

    path: options?.path,
  });
  client.login(env.APPLICATION_SECRET);
};
