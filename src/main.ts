import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";
import { handleEvents } from "./handler";
import { getOptions } from "./cli";
import { checkExists } from "./utils";
import { getFile } from "./database/ops";

export const main = async () => {
  const options = await getOptions();

  if (options === null) return;

  if (
    options.upload &&
    !(await checkExists({
      filename: options.upload,
      readPerm: true,
      isDir: false,
    }))
  ) {
    return;
  }

  if (options.download && !(await getFile(options.download))) {
    console.error("File not found");
    return;
  }

  const APPLICATION_SECRET = process.env.APPLICATION_SECRET;
  const client = new Client({
    intents: [GatewayIntentBits.Guilds],
  });

  if (!APPLICATION_SECRET) {
    console.log("Provide your discord bot token");
    process.exit(-1);
  }
  if (!process.env.TEST_CHANNEL_ID) {
    console.log("Provide a channel id");
    process.exit(-1);
  }

  handleEvents({
    client,
    download: options?.download,
    upload: options?.upload,
    server: options?.server,

    path: options?.path,
  });
  client.login(APPLICATION_SECRET);
};
