import "reflect-metadata";

import DotEnv from "dotenv";

DotEnv.config();

import cors from "cors";
import express from "express";
import { useContainer, useExpressServer } from "routing-controllers";
import Container from "typedi";
import { LyricsRepository, LyricsRepositoryIdentifier } from "./data/repositories/LyricsRepository";
import { AudioController } from "./modules/audio/AudioController";
import { HealthController } from "./modules/health/HealthController";
import { LyricsController } from "./modules/lyrics/LyricsController";

const app = express();
app.use(cors());

Container.set(LyricsRepositoryIdentifier, new LyricsRepository());

useContainer(Container);

useExpressServer(app, {
  controllers: [AudioController, LyricsController, HealthController],
});

app.listen(3001, () => {
  console.log("Server listened on port 3001: http://localhost:3001");
});
