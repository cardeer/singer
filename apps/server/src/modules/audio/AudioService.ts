import { downloadSoundFromLink } from "@/utils/audio";
import { findFullAudioFile, findInstrumentalFile, getFullAudioFileName, getInstrumentalDir } from "@/utils/path";
import ytdl from "@distube/ytdl-core";
import childProcess from "child_process";
import fs from "fs";
import path from "path";
import { Service } from "typedi";
import { GetAudioQueryParams } from "./dto/AudioRequest";
import { DownloadAudioError, GetVideoInfoError, ProcessInstrumentalAudioError } from "./error/AudioError";

@Service()
export class AudioService {
  private async createInstrumentalAudio(audioPath: string, outDir: string) {
    try {
      await new Promise<void>((resolve, reject) => {
        const process = childProcess.spawn(`audio-separator`, [
          audioPath,
          "--output_dir",
          outDir,
          "--output_format",
          "mp3",
          "--model_filename",
          "UVR-MDX-NET-Inst_HQ_3.onnx",
          "--single_stem",
          "Instrumental",
        ]);

        process.stdout.on("data", (data) => {
          console.log(data.toString());
        });

        process.stderr.on("data", (data) => {
          console.log(data.toString());
        });

        process.on("exit", (code) => {
          if (code === 0) {
            resolve();
            return;
          }

          reject();
        });
      });

      const files = fs.readdirSync(outDir);

      if (files.length > 0) {
        return path.resolve(outDir, files[0]);
      }

      throw new ProcessInstrumentalAudioError();
    } catch {
      throw new ProcessInstrumentalAudioError();
    }
  }

  private async getFullAudio(id: string) {
    const link = `https://www.youtube.com/watch?v=${id}`;
    const fullAudioFile = findFullAudioFile(id);

    if (fullAudioFile) {
      console.log(`Found full audio file for ${id}`);
      return fullAudioFile;
    }

    const fullAudioFileName = getFullAudioFileName(id);

    try {
      console.log(`Downloading audio from ${link}`);
      await downloadSoundFromLink(link, fullAudioFileName);
      console.log(`Download success`);
    } catch {
      throw new DownloadAudioError(link);
    }

    return fullAudioFileName;
  }

  private async getInstrumentalAudio(id: string) {
    const fullAudio = await this.getFullAudio(id);
    const currentInstrumentalFile = findInstrumentalFile(id);

    if (currentInstrumentalFile) {
      console.log(`Found instrumental audio file for ${id}`);
      return currentInstrumentalFile;
    }

    const instrumentalFile = await this.createInstrumentalAudio(fullAudio, getInstrumentalDir(id));
    return instrumentalFile;
  }

  public async getAudio(request: GetAudioQueryParams): Promise<string> {
    let link = request.link;

    if (request.id) {
      link = `https://www.youtube.com/watch?v=${request.id}`;
    }

    let info: ytdl.videoInfo;

    try {
      info = await ytdl.getInfo(link!);
    } catch {
      throw new GetVideoInfoError(link);
    }

    console.log(`Getting audio from ${info.videoDetails.title}`);

    const id = request.id ?? info.videoDetails.videoId;

    if (request.type === "full") {
      const audio = await this.getFullAudio(id);
      return audio;
    }

    const audio = await this.getInstrumentalAudio(id);
    return audio;
  }
}
