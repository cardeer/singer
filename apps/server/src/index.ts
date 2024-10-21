import ytdl from "@distube/ytdl-core";
import childProcess from "child_process";
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
  let link = req.query.link as string;
  let type = req.query.type as "full" | "instrumental";

  if (req.query.id) {
    link = `https://www.youtube.com/watch?v=${req.query.id}`;
  }

  const info = await ytdl.getInfo(link);

  console.log(`Getting sound from video ${info.videoDetails.title}`);

  const id = info.videoDetails.videoId;

  const soundsDir = path.resolve(process.cwd(), "sounds");

  if (!fs.existsSync(soundsDir)) {
    fs.mkdirSync(soundsDir);
  }

  const outDir = path.resolve(process.cwd(), "sounds", id);

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }

  const file = path.resolve(outDir, `audio.mp3`);
  const karaokeDir = path.resolve(outDir, "karaoke");

  if (!fs.existsSync(karaokeDir)) {
    fs.mkdirSync(karaokeDir);
  }

  if (fs.existsSync(file) && type === "full") {
    console.log(`Found ${id} from storage`);
    res.status(200).sendFile(file);
    return;
  } else if (type === "instrumental") {
    const files = fs.readdirSync(karaokeDir);
    if (files.length > 0) {
      const instrumentalFile = files.find((file) => file.includes("Instrumental"));
      if (instrumentalFile) {
        console.log("Found karaoke audio from storage", instrumentalFile);
        res.status(200).sendFile(path.resolve(karaokeDir, instrumentalFile));
        return;
      } else {
        res.sendStatus(404);
        return;
      }
    } else {
      if (fs.existsSync(file)) {
        console.log("creating karaoke file");
        childProcess.execSync(
          `audio-separator ${file} --output_format mp3 --output_dir ${karaokeDir} --model_filename UVR-MDX-NET-Inst_HQ_3.onnx --single_stem=Instrumental`
        );
        const files = fs.readdirSync(karaokeDir);
        if (files.length > 0) {
          const instrumentalFile = files.find((file) => file.includes("Instrumental"));
          if (instrumentalFile) {
            res.status(200).sendFile(path.resolve(karaokeDir, instrumentalFile));
            return;
          } else {
            res.sendStatus(404);
            return;
          }
        }
      }
    }
  }

  ytdl(link, {
    filter: "audioonly",
    quality: "highestaudio",
  })
    .pipe(fs.createWriteStream(file))
    .on("finish", () => {
      if (type === "full") {
        res.status(200).sendFile(file);
      } else {
        console.log("creating karaoke file");
        childProcess.execSync(
          `audio-separator ${file} --output_format mp3 --output_dir ${karaokeDir} --model_filename UVR-MDX-NET-Inst_HQ_3.onnx --single_stem=Instrumental`
        );
        const files = fs.readdirSync(karaokeDir);
        if (files.length > 0) {
          const instrumentalFile = files.find((file) => file.includes("Instrumental"));
          if (instrumentalFile) {
            res.status(200).sendFile(path.resolve(karaokeDir, instrumentalFile));
          } else {
            res.sendStatus(404);
          }
        }
      }
    })
    .on("error", () => {
      res.sendStatus(500);
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

  if (!fs.existsSync(lyricsFile)) {
    res.sendStatus(404);
    return;
  }

  const content = fs.readFileSync(lyricsFile, "utf-8");
  res.status(200).json(JSON.parse(content));
});

app.post("/lyrics", async (req, res) => {
  const id = req.body.id;
  const content = req.body.content;

  const lyricsDir = path.resolve(process.cwd(), "lyrics");

  if (!fs.existsSync(lyricsDir)) {
    fs.mkdirSync(lyricsDir);
  }

  const lyricsFile = path.resolve(lyricsDir, `${id}.json`);

  if (fs.existsSync(lyricsFile)) {
    fs.rmSync(lyricsFile);
  }

  fs.writeFileSync(lyricsFile, JSON.stringify(content, null, 2), "utf-8");
  res.sendStatus(201);
});

app.listen(3001, () => {
  console.log(`Server started on https://localhost:3001`);
});
