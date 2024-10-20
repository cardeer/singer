export interface ISongThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface ISongAuthor {
  id: string;
  name: string;
  user: string;
  channel_url: string;
  external_channel_url: string;
  user_url: string;
  thumbnails: ISongThumbnail[];
}

export interface ISongDetails {
  id: string;
  title: string;
  author: ISongAuthor;
  thumbnails: ISongThumbnail[];
}

export interface IKaraokeStoreStates {
  songDetails: ISongDetails | null;
}

export interface IKaraokeStoreActions {
  setSongDetails(details: ISongDetails): void;
  resetSongDetails(): void;
}
