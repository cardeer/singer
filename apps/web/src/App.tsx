import { fetchFile } from '@ffmpeg/util';
import { useRef, useState } from 'react';
import { useKaraoke } from './hooks/useKaraoke';

const App = () => {
  const { ffmpeg, isReady } = useKaraoke();

  const [link, setLink] = useState<string>('');

  const audioRef = useRef<HTMLAudioElement>(null);

  const handleGetKaraoke = async () => {
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

    audioRef.current!.volume = 0.1;
    audioRef.current!.play();
  };

  return (
    <>
      {isReady && (
        <div className="content">
          <input
            className="border border-black p-[8px]"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />

          <audio ref={audioRef} />

          <button className="block" onClick={handleGetKaraoke}>
            submit
          </button>
        </div>
      )}
    </>
  );
};

export default App;
