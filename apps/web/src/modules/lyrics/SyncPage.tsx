import VolumeController from '@/components/VolumeController/VolumeController';
import { http } from '@/http';
import { apiService } from '@/services';
import { useKaraokeStore } from '@/stores/karaokeStore';
import { mdiMusicNote, mdiPause, mdiPlay } from '@mdi/js';
import Icon from '@mdi/react';
import { useMutation } from '@tanstack/react-query';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLyricsStore } from './stores/lyricsStore';

const LyricsSyncPage: FC = () => {
  const navigate = useNavigate();

  const songDetails = useKaraokeStore((state) => state.songDetails);

  const lyrics = useLyricsStore((state) => state.lyrics);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const lyricsRef = useRef<HTMLDivElement>(null);
  const objectUrlRef = useRef<string>();
  const syncDataRef = useRef<[number, string][]>();

  const submitLyricsMutation = useMutation({
    mutationFn: apiService.lyrics.updateLyrics.mutation,
  });

  const lyricsArray = useMemo(() => {
    return (lyrics ?? '').split(/\r?\n/) ?? [];
  }, [lyrics]);

  const getAudio = async () => {
    const response = await http.get('/audio', {
      params: {
        id: songDetails?.id,
        type: 'full',
      },
      responseType: 'arraybuffer',
    });

    const blob = new Blob([response.data], { type: 'audio/mp3' });
    objectUrlRef.current = URL.createObjectURL(blob);

    audioRef.current!.src = objectUrlRef.current;
    const volume = localStorage.getItem('volume');
    audioRef.current!.volume = volume ? parseFloat(volume!) : 0.5;
    audioRef.current!.play();

    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (!isPlaying) {
      audioRef.current!.play();
    } else {
      audioRef.current!.pause();
    }

    setIsPlaying((v) => !v);
  };

  const handleLyricsBlockKeydown = (e: React.KeyboardEvent) => {
    if (e.code === 'Space') {
      e.preventDefault();
    }
  };

  const handleSubmitLyrics = async () => {
    await submitLyricsMutation.mutateAsync([
      songDetails!.id,
      syncDataRef.current!,
    ]);
    navigate('/');
  };

  const handleLyricClick = (index: number) => {
    if (!syncDataRef.current || !audioRef.current) return;

    if (syncDataRef.current[index] && index < currentIndex) {
      audioRef.current.currentTime = syncDataRef.current[index][0];
      setCurrentIndex(index);
    }
  };

  useEffect(() => {
    if (audioRef.current && songDetails) {
      getAudio();
    }
  }, [audioRef]);

  useEffect(() => {
    if (lyricsArray.length > 0) {
      syncDataRef.current = lyricsArray.map((lyric) => [0, lyric]);
    }

    if (!songDetails || !lyrics) {
      navigate('/');
    }

    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }

      if (audioRef.current) {
        audioRef.current!.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  useEffect(() => {
    const handleSpacePressed = (e: KeyboardEvent) => {
      const children = lyricsRef.current!.children;

      if (e.code === 'Space') {
        if (finished || currentIndex === lyricsArray.length - 1 || !isPlaying) {
          return;
        }

        const nextIndex = currentIndex + 1;

        lyricsRef.current?.scrollTo({
          top:
            (children[nextIndex] as HTMLDivElement).offsetTop -
            lyricsRef.current!.clientHeight / 2,
          behavior: 'smooth',
        });

        syncDataRef.current![nextIndex][0] = audioRef.current!.currentTime;
        setCurrentIndex((v) => v + 1);
      }
    };

    document.addEventListener('keydown', handleSpacePressed);

    if (currentIndex === lyricsArray.length - 1) {
      setFinished(true);
    }

    return () => {
      document.removeEventListener('keydown', handleSpacePressed);
    };
  }, [currentIndex, isPlaying, finished]);

  return (
    <>
      {songDetails && (
        <div
          className="h-screen w-screen overflow-hidden pb-[80px]"
          style={{
            backgroundImage: `url(${songDetails.thumbnails[songDetails.thumbnails.length - 1].url})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        >
          <audio ref={audioRef} />

          <div className="absolute left-0 top-0 h-full w-full bg-black/80"></div>

          <div className="relative flex h-full w-full flex-col items-center p-[16px] text-white">
            <div className="text-center text-xl font-bold">
              {songDetails.title}
            </div>

            <div className="mt-[8px] text-center text-sm font-medium">
              {songDetails.author.name}
            </div>

            <div
              ref={lyricsRef}
              className="scrollbar mt-[24px] flex w-full grow flex-col gap-[8px] overflow-auto text-center outline-none"
              onKeyDown={handleLyricsBlockKeydown}
              tabIndex={-1}
            >
              {lyricsArray.map((lyric, i) => (
                <div
                  key={i}
                  className={`mx-auto w-fit cursor-pointer text-center transition-[font-size] duration-150 ${currentIndex === i ? 'text-3xl' : 'text-lg text-gray-400'}`}
                  onClick={() => handleLyricClick(i)}
                >
                  {lyric !== '' ? (
                    lyric
                  ) : (
                    <Icon
                      path={mdiMusicNote}
                      size={currentIndex === i ? 1.5 : 1}
                      className="mx-auto"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 flex h-[80px] w-full items-center bg-black/50 px-[16px]">
        <div onClick={togglePlay} className="cursor-pointer">
          <Icon
            path={isPlaying ? mdiPause : mdiPlay}
            size={1.5}
            color="white"
          />
        </div>

        <div className="ml-auto">
          <VolumeController
            onVolumeChange={(e) => (audioRef.current!.volume = e)}
          />
        </div>

        {finished && (
          <button
            className="ml-[24px] flex items-center gap-[4px] rounded-[8px] bg-green-500 px-[16px] py-[8px] font-medium text-white hover:bg-green-400"
            onClick={handleSubmitLyrics}
          >
            <span>Submit</span>
          </button>
        )}
      </div>
    </>
  );
};

export default LyricsSyncPage;
