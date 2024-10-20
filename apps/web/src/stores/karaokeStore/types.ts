export interface ISongDetails {
  title: string;
  thumbnail: string;
}

export interface IKaraokeStoreStates {
  songDetails: ISongDetails | null;
}

export interface IKaraokeStoreActions {
  setSongDetails(details: ISongDetails): void;
  resetSongDetails(): void;
}
