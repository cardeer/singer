import cors from "cors";
import express from "express";
import fs from "fs";
import path from "path";
import ytdl from "ytdl-core";
import { Downloader } from "ytdl-mp3";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static("../public"));

app.get("/audio", async (req, res) => {
  const link = req.query.path as string;

  const info = await ytdl.getInfo(link);

  console.log(`Getting sound from video ${info.videoDetails.title}`);

  const id = info.videoDetails.videoId;

  const outDir = path.resolve(process.cwd(), "sounds");
  const dir = path.resolve(outDir, id);

  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    res.status(200).sendFile(path.resolve(dir, files[0]));
    return;
  }

  fs.mkdirSync(dir);

  const downloader = new Downloader({
    outputDir: dir,
    getTags: true,
  });

  const file = await downloader.downloadSong(link);
  res.status(200).sendFile(file);
});

app.listen(3001, () => {
  console.log(`Server started on https://localhost:3001`);
});
