import { ChannelType, Client } from "discord.js";
import axios from "axios";
import { Readable, Writable } from "stream";
import { createServer } from "./server";
import { assembleFile, uploadFile } from "./chunking";
import { getFile } from "./database/ops";
import { createLogger } from "./logger";

type Options = {
  client: Client;

  upload?: string;
  download?: string;

  server?: undefined | boolean;

  path?: string;
};
export const handleEvents = async ({
  client,
  server,
  download,
  upload,
  path,
}: Options) => {
  const logger = createLogger("handler");

  client.once("ready", async function (client) {
    logger.success(`${client.user.username} is ready`);

    const channel = await client.channels.fetch(process.env.TEST_CHANNEL_ID!);
    if (!channel) {
      logger.error("Unknown channel");
      process.exit(-1);
    }

    if (channel?.type !== ChannelType.GuildText) {
      logger.error("Channel is not in text mode");
      process.exit(-1);
    }

    server && createServer(channel);

    if (upload) {
      const res = await uploadFile(upload, channel);
      if (res?.error) {
        await client.destroy();
        process.exit(-1);
      }
    } else if (download) {
      const file = await getFile(download);

      if (!file) {
        logger.error("File not found");
        await client.destroy();
        process.exit(-1);
      }

      const res = await assembleFile(file, path!, channel);

      if (res?.error) {
        await client.destroy();
        process.exit(-1);
      }
    }

    if (!server) {
      await client.destroy();
      process.exit(0);
    }
  });

  client.on("shardDisconnect", () => {
    logger.warn("Bot Disconnected");
  });
};

export const writeStreamAxios = async (url: string, writeStream: Writable) => {
  const { data } = await axios.get<Readable>(url, {
    responseType: "stream",
    decompress: false,
  });

  return new Promise<void>((res, rej) => {
    data.pipe(writeStream, {
      end: false,
    });

    data.on("end", () => {
      res();
    });

    data.on("error", () => {
      console.log(url, "error");
      rej();
    });
  });
};
