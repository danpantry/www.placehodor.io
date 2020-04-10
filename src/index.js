import express from "express";
import sharp from "sharp";
import { promises as fs, createReadStream } from "fs";
import { pipeline } from "stream";
import path from "path";

const PORT = process.env.PORT ?? 8080;
const HOSTNAME = process.env.HOSTNAME ?? "localhost";

const app = express();

app.get("/:width/:height", async (req, res, next) => {
  try {
    const height = parseInt(req.params.height, 10);
    const width = parseInt(req.params.width, 10);

    const dir = path.resolve(__dirname, "../static/images");
    const files = await fs.readdir(dir);
    const idx = Math.ceil(Math.random() * files.length - 1);
    const filename = files[idx];
    pipeline(
      createReadStream(path.resolve(dir, filename)),
      sharp().resize(width, height).toFormat("webp"),
      res,
      (err) => {
        if (err != null) {
          console.log(err);
          return;
        }

        res.end();
      }
    );
  } catch (e) {
    next(e);
  }
});

app.listen(PORT, HOSTNAME);
