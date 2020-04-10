import express from "express";
import { createReadStream, promises as fs } from "fs";
import path from "path";
import sharp from "sharp";
import { pipeline } from "stream";
import { promisify } from "util";
const pipe = promisify(pipeline);

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

    await pipe(
      createReadStream(path.resolve(dir, filename), { autoClose: true }),
      sharp().resize(width, height).toFormat("webp"),
      res
    );

    res.end();
  } catch (e) {
    next(e);
  }
});

app.listen(PORT, HOSTNAME);
