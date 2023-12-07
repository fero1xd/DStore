import { ChannelType, Client } from "discord.js";
import axios from "axios";
import { Readable, Writable } from "stream";
import { createServer } from "./server";
import { assembleFile, uploadFile } from "./chunking";
import { getFile } from "./database/ops";
import { File } from "./database/types";

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
  client.once("ready", async function (client) {
    console.log(`${client.user.username} is ready`);

    const channel = await client.channels.fetch(process.env.TEST_CHANNEL_ID!);
    if (!channel) {
      console.log("Unknown channel");
      process.exit(-1);
    }

    if (channel?.type !== ChannelType.GuildText) {
      console.log("Channel is not in text mode");
      process.exit(-1);
    }

    server && createServer(channel);

    if (upload) {
      uploadFile(upload, channel);
    } else if (download) {
      const file = (await getFile(download)) as File;
      assembleFile(file, path!, channel);
    }
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
