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
    // Storing files on this image is likely a mistake -
    // It would mean a re-deploy every time we want to add a new one.
    // Probably better to use S3.
    // This would also enable us to precompute some common sizes ahead of time.
    // Alternatively, a volume could work, and would also allow us to cache recent images.
    // Really, though, we should monitor our usage before trying any of this.
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

const server = app.listen(PORT, HOSTNAME);
process.on("SIGTERM", () => {
  server.close();
});

process.on("SIGINT", () => {
  server.close();
});
