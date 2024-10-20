import { create } from 'zustand';
import { IKaraokeStoreActions, IKaraokeStoreStates } from './types';

export const useKaraokeStore = create<
  IKaraokeStoreStates & IKaraokeStoreActions
>((set) => {
  return {
    songDetails: null,

    setSongDetails(details) {
      set({
        songDetails: details,
      });
    },

    resetSongDetails() {
      set({
        songDetails: null,
      });
    },
  };
});
