import ytdl from "@distube/ytdl-core";
import { Service } from "typedi";
import { IGetSongDetailsResponse } from "./dto/DetailsResponse";

@Service()
export class DetailsService {
  public async getSongDetails(link: string): Promise<IGetSongDetailsResponse> {
    const info = await ytdl.getInfo(link);

    return {
      id: info.videoDetails.videoId,
      title: info.videoDetails.title,
      author: info.videoDetails.author,
      thumbnails: info.videoDetails.thumbnails,
    };
  }
}
