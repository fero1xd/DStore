import { TextChannel } from "discord.js";
import express from "express";
import { writeStreamAxios } from "./handler";
import { getFile } from "./database/ops";

export const createServer = async (channel: TextChannel) => {
  const app = express();
  app.use(express.json());

  app.get("/:fileId", async (req, res) => {
    try {
      const fileId = req.params.fileId;

      const file = await getFile(fileId);

      if (!file || !file.chunks) {
        return res.status(404).send("File not found");
      }

      console.log(`Gotta fetch ${file.chunks.length} chunk(s)`);

      res.contentType(file.contentType);
      for (const chunk of file.chunks) {
        const message = await channel.messages.fetch(chunk);
        await writeStreamAxios(message.attachments.first()!.url, res);
      }
      res.end();
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  });

  app.listen(3000, () => {
    console.log("Server started at port 3000");
  });
};
