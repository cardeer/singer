/* eslint-disable @typescript-eslint/no-explicit-any */
import VolumeController from '@/components/VolumeController';
import { apiService } from '@/services';
import { useKaraokeStore } from '@/stores/karaokeStore';
import { mdiArrowLeft, mdiPause, mdiPlay } from '@mdi/js';
import Icon from '@mdi/react';
import { useQuery } from '@tanstack/react-query';
import { FC, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const KaraokePage: FC = () => {
  const navigate = useNavigate();
  const songDetails = useKaraokeStore((state) => state.songDetails);

  const [lyrics, setLyrics] = useState<[number, string][]>([]);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const objectUrl = useRef<string>();
  const audioRef = useRef<HTMLAudioElement>(null);

  const getLyricsQuery = useQuery({
    queryKey: ['lyrics', songDetails?.id],
    queryFn: () => apiService.lyrics.getLyrics(songDetails!.id),
    retry: 0,
  });

  const getInstrumentalAudio = useQuery({
    queryKey: ['instrumental', songDetails?.id],
    queryFn: () =>
      apiService.audio.getAudio({ id: songDetails!.id, type: 'instrumental' }),
    enabled: false,
  });

  const handleAudioTimeUpdate = () => {
    if (!audioRef.current) return;

    const currentTime = audioRef.current!.currentTime;
    setCurrentTime(currentTime);
  };

  const handleTogglePlayPause = () => {
    if (!audioRef.current) return;

    if (!isPlaying) {
      setIsPlaying(true);
      audioRef.current.play();
    } else {
      setIsPlaying(false);
      audioRef.current.pause();
    }
  };

  useEffect(() => {
    if (!songDetails) {
      navigate('/');
    }

    return () => {
      if (objectUrl.current) {
        URL.revokeObjectURL(objectUrl.current);
      }

      if (audioRef.current) {
        audioRef.current!.pause();
        audioRef.current!.currentTime = 0;

        audioRef.current.removeEventListener(
          'timeupdate',
          handleAudioTimeUpdate,
        );
      }
    };
  }, []);

  useEffect(() => {
    if (getLyricsQuery.isSuccess && getLyricsQuery.data) {
      setLyrics(getLyricsQuery.data.lyrics);
      getInstrumentalAudio.refetch();
    } else if (getLyricsQuery.isError) {
      getInstrumentalAudio.refetch();
    }
  }, [getLyricsQuery.isSuccess, getLyricsQuery.data, getLyricsQuery.isError]);

  useEffect(() => {
    if (getInstrumentalAudio.isSuccess && getInstrumentalAudio.data) {
      objectUrl.current = URL.createObjectURL(
        new Blob([getInstrumentalAudio.data], { type: 'audio/mp3' }),
      );

      audioRef.current!.src = objectUrl.current!;
      audioRef.current!.volume = localStorage.getItem('volume')
        ? parseInt(localStorage.getItem('volume')!) / 100
        : 0.5;
      audioRef.current!.play().catch(() => {});
      audioRef.current!.addEventListener('timeupdate', handleAudioTimeUpdate);

      setIsPlaying(true);
      setIsReady(true);
    }
  }, [getInstrumentalAudio.isSuccess, getInstrumentalAudio.data]);

  useEffect(() => {
    if (currentIndex < lyrics.length - 1) {
      const nextLyric = lyrics[currentIndex + 1];

      if (currentTime >= nextLyric[0]) {
        setCurrentIndex((v) => v + 1);
      }
    }
  }, [currentTime, currentIndex]);

  return (
    <>
      <audio ref={audioRef} className="hidden" />

      <div
        className="fixed left-[20px] top-[20px] flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-md bg-white"
        onClick={() => navigate('/')}
      >
        <Icon path={mdiArrowLeft} size={1.3} color="black" />
      </div>

      {!isReady && (
        <div className="fixed left-0 top-0 z-20 flex h-full w-full flex-col items-center justify-center bg-black/80 text-center text-white">
          <div className="text-3xl">Loading ...</div>
          <div className="mt-[16px] text-sm">
            This may a take a few minutes for the first time.
          </div>
        </div>
      )}

      {songDetails && (
        <div
          className="h-screen w-screen text-white"
          style={{
            backgroundImage: `url(${songDetails!.thumbnails[songDetails!.thumbnails.length - 1].url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {isReady && (
            <div className="flex h-full w-full flex-col items-center justify-center gap-[16px] bg-black/80">
              {lyrics.length > 0 ? (
                <>
                  <div className="text-3xl">{lyrics[currentIndex][1]}</div>

                  {currentIndex < lyrics.length - 1 && (
                    <div className="text-lg text-gray-400">
                      {lyrics[currentIndex + 1][1]}
                    </div>
                  )}

                  {currentIndex < lyrics.length - 2 && (
                    <div className="text-lg text-gray-400">
                      {lyrics[currentIndex + 2][1]}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-3xl">No Lyrics Available</div>
              )}

              <div
                className="absolute bottom-[20px] flex h-[50px] w-[50px] cursor-pointer items-center justify-center overflow-hidden rounded-full border-[3px] border-white"
                onClick={handleTogglePlayPause}
              >
                <Icon
                  path={isPlaying ? mdiPause : mdiPlay}
                  size={1.5}
                  color="white"
                />
              </div>

              <div className="absolute bottom-[35px] right-[20px]">
                <VolumeController
                  onVolumeChange={(e) => (audioRef.current!.volume = e / 100)}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default KaraokePage;
