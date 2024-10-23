import { Author, VideoDetails } from "@distube/ytdl-core";

export interface IGetSongDetailsResponse {
  id: string;
  title: string;
  author: Author;
  thumbnails: VideoDetails["thumbnails"];
}
