import ytdl from "@distube/ytdl-core";
import fs from "fs";

export function downloadSoundFromLink(link: string, fileName: string) {
  return new Promise<void>((resolve, reject) => {
    ytdl(link, {
      filter: "audioonly",
      quality: "highestaudio",
    })
      .pipe(fs.createWriteStream(fileName))
      .on("finish", () => {
        resolve();
      })
      .on("error", () => {
        reject();
      });
  });
}
