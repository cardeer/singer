import { create } from 'zustand';

interface ILyricsStoreStates {
  lyrics: string;
}

interface ILyricsStoreActions {
  setLyrics(lyrics: string): void;
  reset(): void;
}

export const useLyricsStore = create<ILyricsStoreStates & ILyricsStoreActions>(
  (set) => {
    return {
      lyrics: '',

      setLyrics(lyrics) {
        set({
          lyrics,
        });
      },

      reset() {
        set({
          lyrics: '',
        });
      },
    };
  },
);
