import express from "express";

const PORT = process.env.PORT ?? 8080;
const HOSTNAME = process.env.HOSTNAME ?? "localhost";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(PORT, HOSTNAME);
