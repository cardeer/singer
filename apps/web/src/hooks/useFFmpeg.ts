import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';
import { useEffect, useRef, useState } from 'react';

export function useFFmpeg() {
  const ffmpegRef = useRef<FFmpeg>(new FFmpeg());

  const [isReady, setIsReady] = useState<boolean>(false);

  const loadFFmpeg = async () => {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';

    await ffmpegRef.current!.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        'application/wasm',
      ),
    });

    ffmpegRef.current!.on('log', ({ message }) => {
      console.log(message);
    });

    setIsReady(true);
  };

  useEffect(() => {
    loadFFmpeg();

    const ffmpeg = ffmpegRef.current;

    return () => {
      ffmpeg?.terminate();
    };
  }, []);

  return {
    ffmpeg: ffmpegRef.current!,
    isReady,
  };
}
