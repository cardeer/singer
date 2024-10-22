import "reflect-metadata";

import cors from "cors";
import express from "express";
import { useContainer, useExpressServer } from "routing-controllers";
import Container from "typedi";
import { AudioController } from "./modules/audio/AudioController";
import { HealthController } from "./modules/health/HealthController";
import { LyricsController } from "./modules/lyrics/LyricsController";

const app = express();
app.use(cors());

useContainer(Container);

useExpressServer(app, {
  controllers: [AudioController, LyricsController, HealthController],
});

app.listen(3001, () => {
  console.log("Server listened on port 3001: http://localhost:3001");
});
