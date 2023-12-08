import { TextChannel } from "discord.js";
import express from "express";
import { writeStreamAxios } from "./handler";
import { getFile } from "./database/ops";
import { createLogger } from "./logger";
import { env } from "./env";

export const createServer = async (channel: TextChannel) => {
  const logger = createLogger("server");

  logger.info("Running a web server on port 3000");
  const app = express();
  app.use(express.json());

  app.get("/:fileId", async (req, res) => {
    try {
      const fileId = req.params.fileId;

      const file = await getFile(fileId);

      if (!file || !file.chunks) {
        return res.status(404).send("File not found");
      }

      logger.info(`Gotta fetch ${file.chunks.length} chunk(s)`);

      res.contentType(file.contentType);
      for (const chunk of file.chunks) {
        // TODO: Add validation here
        const message = await channel.messages.fetch(chunk);
        await writeStreamAxios(message.attachments.first()!.url, res);
      }

      logger.success(`Successfully served ${file.chunks.length} chunk(s)`);
      res.end();
    } catch (err) {
      console.error(err);
      logger.error("Error serving chunks");
      res.status(500).send("Server error");
    }
  });

  app.listen(env.EXPRESS_PORT, () => {
    logger.success("Server started at port 3000");
  });
};
