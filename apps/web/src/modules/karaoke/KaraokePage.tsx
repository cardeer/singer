import { apiService } from '@/services';
import { useKaraokeStore } from '@/stores/karaokeStore';
import { useQuery } from '@tanstack/react-query';
import { FC, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const KaraokePage: FC = () => {
  const navigate = useNavigate();
  const songDetails = useKaraokeStore((state) => state.songDetails);

  const [lyrics, setLyrics] = useState<[number, string][]>([]);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const objectUrl = useRef<string>();
  const audioRef = useRef<HTMLAudioElement>(null);

  const getLyricsQuery = useQuery({
    queryKey: ['lyrics'],
    queryFn: () => apiService.lyrics.getLyrics(songDetails!.id),
    retry: 0,
  });

  const getInstrumentalAudio = useQuery({
    queryKey: ['instrumental'],
    queryFn: () =>
      apiService.audio.getAudio({ id: songDetails!.id, type: 'instrumental' }),
    enabled: false,
  });

  const handleAudioTimeUpdate = () => {
    const currentTime = audioRef.current!.currentTime;
    setCurrentTime(currentTime);
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
        audioRef.current.removeEventListener(
          'timeupdate',
          handleAudioTimeUpdate,
        );
      }
    };
  }, []);

  useEffect(() => {
    if (getLyricsQuery.isSuccess && getLyricsQuery.data) {
      getInstrumentalAudio.refetch();
      setLyrics(getLyricsQuery.data);
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
      audioRef.current!.volume = 0.5;
      audioRef.current!.play();
      audioRef.current!.addEventListener('timeupdate', handleAudioTimeUpdate);
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
        className="h-screen w-screen text-white"
        style={{
          backgroundImage: `url(${songDetails!.thumbnails[songDetails!.thumbnails.length - 1].url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="flex h-full w-full flex-col items-center justify-center gap-[16px] bg-black/80">
          {lyrics.length > 0 ? (
            <>
              <div className="text-3xl">{lyrics[currentIndex][1]}</div>

              {currentIndex < lyrics.length - 1 && (
                <div className="text-lg text-gray-400">
                  {lyrics[currentIndex + 1][1]}
                </div>
              )}
            </>
          ) : (
            <div className="text-3xl">No Lyrics Available</div>
          )}
        </div>
      </div>
    </>
  );
};

export default KaraokePage;
