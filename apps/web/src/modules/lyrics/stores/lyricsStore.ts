import { create } from 'zustand';

interface ILyricsStoreStates {
  lyrics: string;
  syncedLyrics: [number, string][];
}

interface ILyricsStoreActions {
  setLyrics(lyrics: string): void;
  setSyncedLyrics(data: ILyricsStoreStates['syncedLyrics']): void;
}

export const useLyricsStore = create<ILyricsStoreStates & ILyricsStoreActions>(
  (set) => {
    return {
      lyrics: '',
      syncedLyrics: [],

      setLyrics(lyrics) {
        set({
          lyrics,
        });
      },

      setSyncedLyrics(data) {
        set({
          syncedLyrics: data,
        });
      },
    };
  },
);
