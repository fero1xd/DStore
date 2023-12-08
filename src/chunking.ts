import { AttachmentBuilder, TextChannel } from "discord.js";
import mime from "mime-types";
import { v4 } from "uuid";
import { createReadStream, createWriteStream, statSync } from "fs";
import { writeStreamAxios } from "./handler";
import { insertFile } from "./database/ops";
import { File } from "./database/types";
import path from "path";
import { createLogger } from "./logger";

const CHUNK_SIZE = 25690112; // 25 mb
const uploadLogger = createLogger("uploader");
const downloadLogger = createLogger("assembler");

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

    readStream.on("end", async () => {
      readStream.close();
    });

    await waitForEveryone(
      filename,
      doneMap,
      totalChunks,
      contentType || "application/octet-stream",
      totalChunks,
    );
  } catch (err) {
    console.error(err);
    uploadLogger.error("Error sending files to discord");

    return {
      error: true,
    };
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
    uploadLogger.info(
      `Waiting for ${totalChunks} chunk(s) to get delivered, this may take a lot of time.`,
    );

    const interval = setInterval(() => {
      if (done.chunkIds.length === total) {
        clearInterval(interval);
        uploadLogger.success(`Delivered ${done.chunkIds.length} chunk(s)`);
        insertFile({
          name: filename,
          chunks: done.chunkIds,
          contentType,
        })
          .then((file) => {
            if (!file) {
              return uploadLogger.error("File upload to database maybe failed");
            }
            uploadLogger.success(
              `File Id:${file.id} inserted in database successfully`,
            );
            console.log(file);
          })
          .catch((err) => {
            uploadLogger.error("File insertion to database failed");
            uploadLogger.error(err);
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
  uploadLogger.success(`Delivered Chunk Id:${msg.id}, Serial no:${sno}`);
  const percentage =
    (Math.min(valMap.chunkIds.length * 25690112, fileSize) / fileSize) * 100;

  uploadLogger.info(`Uploaded: ${percentage.toFixed(2)}%`);
};

export const assembleFile = async (
  { name, chunks }: File,
  dirName: string,
  channel: TextChannel,
) => {
  try {
    if (!chunks) {
      downloadLogger.error("No chunks associated with this file");
      return;
    }
    downloadLogger.info(`Fetching ${chunks.length} chunk(s)`);
    const pathToSave = path.resolve(dirName, name);
    const writeStream = createWriteStream(pathToSave);

    for (const chunk of chunks) {
      try {
        const message = await channel.messages.fetch(chunk);
        const att = message.attachments.first();
        if (!att) {
          throw new Error("No attachemt found in this message");
        }
        await writeStreamAxios(att.url, writeStream);
      } catch (err) {
        downloadLogger.error(
          `Message related to Chunk:${chunk} is either deleted or not retrievable`,
        );
        console.error(err);
        downloadLogger.error(`Error fetching Chunk:${chunk}`);

        return {
          error: true,
        };
      }
    }

    downloadLogger.success(
      `Successfully assembled ${chunks.length} chunk(s) in ${pathToSave}`,
    );
    writeStream.close();
  } catch (er) {
    console.error(er);
    downloadLogger.error("Error assembling chunks into a file");

    return {
      error: true,
    };
  }
};
