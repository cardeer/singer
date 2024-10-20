import { fetchFile } from '@ffmpeg/util';
import { lazy, useRef, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import LazyPage from './components/LazyPage';
import { useFFmpeg } from './hooks/useFFmpeg';

const SelectPage = lazy(() => import('@/modules/select/SelectPage'));

const App = () => {
  const { ffmpeg, isReady } = useFFmpeg();

  const [link, setLink] = useState<string>('');

  const audioRef = useRef<HTMLAudioElement>(null);

  const handleGetKaraoke = async () => {
    try {
      await ffmpeg.deleteFile('audio.mp3');
      await ffmpeg.deleteFile('karaoke.mp3');
    } catch (error: unknown) {
      console.log('No previous karaoke file');
    }

    const file = await fetchFile(
      `http://localhost:3001/audio?link=${encodeURI(link)}`,
    );

    await ffmpeg.writeFile('audio.mp3', file);

    await ffmpeg.exec([
      '-i',
      'audio.mp3',
      '-af',
      'pan=stereo|c0=c0|c1=-1*c1',
      '-ac',
      '1',
      'karaoke.mp3',
    ]);

    const data = (await ffmpeg.readFile('karaoke.mp3')) as Buffer;

    audioRef.current!.src = URL.createObjectURL(
      new Blob([data.buffer], { type: 'audio/mp3' }),
    );

    audioRef.current!.volume = 0.5;
    audioRef.current!.play();
  };

  return (
    <Routes>
      <Route index element={<LazyPage component={SelectPage} />} />
    </Routes>
  );
};

export default App;
