import { AttachmentBuilder, TextChannel } from "discord.js";
import mime from "mime-types";
import { v4 } from "uuid";
import { createReadStream, createWriteStream, statSync } from "fs";
import { writeStreamAxios } from "./handler";
import { insertFile } from "./database/ops";
import { File } from "./database/types";
import path from "path";

const CHUNK_SIZE = 25690112; // 25 mb

export const uploadFile = async (filepath: string, channel: TextChannel) => {
  try {
    const stats = statSync(filepath);
    const totalChunks = Math.ceil(stats.size / CHUNK_SIZE);
    const filename = path.basename(filepath);

    const readStream = createReadStream(filepath, {
      highWaterMark: CHUNK_SIZE,
    });

    let count = 1;
    const doneMap = {
      chunkIds: [],
    };

    const extension = mime.extension(filepath);
    const contentType = mime.lookup(filepath);

    readStream.on("data", async (buff) => {
      readStream.pause();
      const att = new AttachmentBuilder(buff, {
        name: `${v4()}${extension ? `.${extension}` : ""}`,
      });

      await sendAttachemnt(count, channel, att, doneMap, stats.size);
      count += 1;

      readStream.resume();
    });

    await waitForEveryone(
      filename,
      doneMap,
      totalChunks,
      contentType || "application/octet-stream",
      totalChunks,
    );

    readStream.on("end", async () => {
      console.log("all messages sent");
    });
  } catch (err) {
    console.error(err);
    console.log("Error sending files to discord");
  }
};

const waitForEveryone = (
  filename: string,
  done: Record<string, any>,
  total: number,
  contentType: string,
  totalChunks: number,
) => {
  return new Promise<void>((res) => {
    console.log(
      `Waiting for ${totalChunks} chunk(s) to get delivered, this may take a lot of time.`,
    );

    let secs = 1;

    const interval = setInterval(() => {
      secs += 1;

      if (done.chunkIds.length === total) {
        clearInterval(interval);
        console.log(
          `Delivered ${done.chunkIds.length} chunk(s) in ${secs} seconds`,
        );
        insertFile({
          name: filename,
          chunks: done.chunkIds,
          contentType,
        })
          .then((file) => {
            if (!file) {
              return console.error("File upload to database maybe failed");
            }
            console.log(`File Id:${file.id} inserted in database successfuly`);
            console.log(file);
          })
          .catch((err) => {
            console.log("File insertion to database failed");
            console.error(err);
          })
          .finally(() => {
            res();
          });
      }
    }, 1000);
  });
};

const sendAttachemnt = async (
  sno: number,
  chan: TextChannel,
  att: AttachmentBuilder,
  valMap: Record<string, any>,
  fileSize: number,
) => {
  const msg = await chan.send({ files: [att] });

  valMap.chunkIds.push(msg.id);
  console.log("Delivered Chunk id:", msg.id, "serial no:", sno);
  const percentage =
    (Math.min(valMap.chunkIds.length * 25690112, fileSize) / fileSize) * 100;

  console.log(`Uploaded: ${percentage.toFixed(2)}%`);
};

export const assembleFile = async (
  { name, chunks }: File,
  dirName: string,
  channel: TextChannel,
) => {
  if (!chunks) {
    console.log("No chunks associated with this file");
    return;
  }
  console.log(`Fetching ${chunks.length} chunk(s)`);
  const writeStream = createWriteStream(path.resolve(dirName, name));
  for (const chunk of chunks) {
    const message = await channel.messages.fetch(chunk);
    await writeStreamAxios(message.attachments.first()!.url, writeStream);
  }

  console.log(`Successfuly assembled ${chunks.length} chunk(s)`);
  writeStream.close();
};
