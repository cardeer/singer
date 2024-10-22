import { downloadSoundFromLink } from "@/utils/audio";
import { findFullAudioFile, getFullAudioFileName } from "@/utils/path";
import ytdl from "@distube/ytdl-core";
import childProcess from "child_process";
import fs from "fs";
import path from "path";
import { Service } from "typedi";
import { GetAudioQueryParams } from "./dto/AudioRequest";
import { DownloadAudioError, GetVideoInfoError, ProcessInstrumentalAudioError } from "./error/AudioError";

@Service()
export class AudioService {
  private async getInstrumentalAudio(audioPath: string, outDir: string) {
    try {
      await childProcess.execSync(
        `audio-separator ${audioPath} --output_dir ${outDir} --output_format mp3 --model_filename UVR-MDX-NET-Inst_HQ_3.onnx --single_stem=Instrumental`
      );

      const files = fs.readdirSync(outDir);

      if (files.length > 0) {
        return path.resolve(outDir, files[0]);
      }

      return null;
    } catch {
      throw new ProcessInstrumentalAudioError();
    }
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

    const fullAudioFile = findFullAudioFile(id);

    if (fullAudioFile) {
      return fullAudioFile;
    }

    const fullAudioFileName = getFullAudioFileName(id);

    try {
      await downloadSoundFromLink(link, fullAudioFileName);
    } catch {
      throw new DownloadAudioError(link);
    }

    return fullAudioFileName;
  }
}
