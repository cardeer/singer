import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { useRef, useState } from 'react';

const App = () => {
  const [link, setLink] = useState<string>(
    'https://www.youtube.com/watch?v=DHea-Qcy9g0',
  );

  const audioRef = useRef<HTMLAudioElement>(null);

  const handleGetKaraoke = async () => {
    const ffmpeg = new FFmpeg();
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        'application/wasm',
      ),
    });

    ffmpeg.on('log', ({ message }) => {
      console.log(message);
    });

    const file = await fetchFile(
      `http://localhost:3001/audio?path=${encodeURI(link)}`,
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
  );
};

export default App;
