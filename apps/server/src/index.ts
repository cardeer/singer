import ytdl from "@distube/ytdl-core";
import cors from "cors";
import express from "express";
import fs from "fs";
import path from "path";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static("../public"));

app.get("/audio", async (req, res) => {
  const link = req.query.link as string;

  const info = await ytdl.getInfo(link);

  console.log(`Getting sound from video ${info.videoDetails.title}`);

  const id = info.videoDetails.videoId;

  const outDir = path.resolve(process.cwd(), "sounds");

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }

  const file = path.resolve(outDir, `${id}.mp3`);

  if (fs.existsSync(file)) {
    console.log(`Found ${id} from storage`);
    res.status(200).sendFile(file);
    return;
  }

  res.on("finish", () => {
    fs.rmSync(file);
  });

  ytdl(link, {
    filter: "audioonly",
    quality: "highestaudio",
  })
    .pipe(fs.createWriteStream(file))
    .on("finish", () => {
      res.status(200).sendFile(file);
    })
    .on("error", () => {
      res.status(500);
    });
});

app.listen(3001, () => {
  console.log(`Server started on https://localhost:3001`);
});
