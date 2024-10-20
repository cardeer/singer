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

app.get("/details", async (req, res) => {
  const link = req.query.link as string;
  const info = await ytdl.getInfo(link);
  const videoDetails = info.videoDetails;

  res.status(200).json({
    id: videoDetails.videoId,
    title: videoDetails.title,
    author: videoDetails.author,
    thumbnails: videoDetails.thumbnails,
  });
});

app.get("/lyrics/:id", async (req, res) => {
  const id = req.params.id;

  const lyricsDir = path.resolve(process.cwd(), "lyrics");

  if (!lyricsDir) {
    fs.mkdirSync(lyricsDir);
  }

  const lyricsFile = path.resolve(lyricsDir, `${id}.json`);

  if (!lyricsFile) {
    res.status(404);
    return;
  }

  const content = fs.readFileSync(lyricsFile, "utf-8");
  res.status(200).json(JSON.parse(content));
});

app.post("/lyrics", async (req, res) => {
  const id = req.body.id;
  const content = req.body.content;

  const lyricsDir = path.resolve(process.cwd(), "lyrics");

  if (!lyricsDir) {
    fs.mkdirSync(lyricsDir);
  }

  const lyricsFile = path.resolve(lyricsDir, `${id}.json`);

  fs.writeFileSync(lyricsFile, JSON.stringify(content, null, 2), "utf-8");
  res.status(201);
});

app.listen(3001, () => {
  console.log(`Server started on https://localhost:3001`);
});
