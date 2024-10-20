import { useFFmpeg } from '@/hooks/useFFmpeg';
import { http } from '@/http';
import { useKaraokeStore } from '@/stores/karaokeStore';
import { FC, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const KaraokePage: FC = () => {
  const navigate = useNavigate();

  const { ffmpeg, isReady: ffmpegReady } = useFFmpeg();

  const songDetails = useKaraokeStore((state) => state.songDetails);

  const [isReady, setIsReady] = useState<boolean>(false);
  const [lyrics, setLyrics] = useState<[number, string][]>([]);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const objectUrl = useRef<string>();
  const audioRef = useRef<HTMLAudioElement>(null);

  // const getKaraokeAudio = async () => {
  //   try {
  //     await ffmpeg.deleteFile('audio.mp3');
  //     await ffmpeg.deleteFile('karaoke.mp3');
  //   } catch (error: unknown) {
  //     console.log('No previous karaoke file');
  //   }

  //   const file = await fetchFile(
  //     `http://localhost:3001/audio?id=${songDetails!.id})}`,
  //   );

  //   await ffmpeg.writeFile('audio.mp3', file);

  //   await ffmpeg.exec([
  //     '-i',
  //     'audio.mp3',
  //     '-af',
  //     'pan=stereo|c0=c0|c1=-1*c1',
  //     '-ac',
  //     '1',
  //     'karaoke.mp3',
  //   ]);

  //   const data = (await ffmpeg.readFile('karaoke.mp3')) as Buffer;

  //   objectUrl.current = URL.createObjectURL(
  //     new Blob([data.buffer], { type: 'audio/mp3' }),
  //   );

  //   audioRef.current!.src = objectUrl.current!;
  //   audioRef.current!.volume = 0.5;
  //   audioRef.current!.play();
  //   audioRef.current!.addEventListener('timeupdate', handleAudioTimeUpdate);
  // };

  const fetchKaraokeAudio = async () => {
    const response = await http.get('/audio', {
      params: {
        id: songDetails!.id,
        type: 'instrumental',
      },
      responseType: 'arraybuffer',
    });

    objectUrl.current = URL.createObjectURL(
      new Blob([response.data], { type: 'audio/mp3' }),
    );

    console.log(response.data);

    audioRef.current!.src = objectUrl.current!;
    audioRef.current!.volume = 0.5;
    audioRef.current!.play();
    audioRef.current!.addEventListener('timeupdate', handleAudioTimeUpdate);
  };

  const fetchLyrics = async () => {
    try {
      const response = await http.get(`/lyrics/${songDetails!.id}`);
      setLyrics(response.data);
      setIsReady(true);
    } catch {
      setLyrics([]);
    }
  };

  const handleAudioTimeUpdate = () => {
    const currentTime = audioRef.current!.currentTime;
    setCurrentTime(currentTime);
  };

  useEffect(() => {
    if (!songDetails) {
      navigate('/');
    } else {
      fetchLyrics().then(() => fetchKaraokeAudio());
    }

    return () => {
      if (objectUrl.current) {
        URL.revokeObjectURL(objectUrl.current);
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener(
          'timeupdate',
          handleAudioTimeUpdate,
        );
      }
    };
  }, [audioRef]);

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
      <audio ref={audioRef} />

      {isReady && (
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
            <div className="text-3xl">{lyrics[currentIndex][1]}</div>

            {currentIndex < lyrics.length - 1 && (
              <div className="text-lg text-gray-400">
                {lyrics[currentIndex + 1][1]}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default KaraokePage;
