import { useKaraokeStore } from '@/stores/karaokeStore';
import { mdiSync } from '@mdi/js';
import Icon from '@mdi/react';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLyricsStore } from './stores/lyricsStore';

const EditLyricsPage: FC = () => {
  const navigate = useNavigate();

  const songDetails = useKaraokeStore((state) => state.songDetails);

  const storeLyrics = useLyricsStore((state) => state.lyrics);
  const setStoreLyrics = useLyricsStore((state) => state.setLyrics);

  const [lyrics, setLyrics] = useState<string>(storeLyrics);

  const handleSyncClick = () => {
    setStoreLyrics(
      lyrics
        .split('\n')
        .filter((line) => line !== '')
        .join('\n'),
    );
    navigate('/lyrics/sync');
  };

  useEffect(() => {
    if (!songDetails) {
      navigate('/');
    }
  }, []);

  return (
    <>
      {songDetails && (
        <div
          className="h-screen w-screen"
          style={{
            backgroundImage: `url(${songDetails.thumbnails[songDetails.thumbnails.length - 1].url})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute left-0 top-0 h-full w-full bg-black/80"></div>

          <div className="relative flex h-screen w-screen flex-col items-center p-[16px] text-white">
            <div className="text-center text-xl font-bold">
              {songDetails.title}
            </div>

            <div className="mt-[8px] text-center text-sm font-medium">
              {songDetails.author.name}
            </div>

            <div className="mt-[24px] text-lg font-medium">Lyrics</div>
            <div className="mt-[16px] w-full max-w-[500px] grow rounded-[8px] border border-white">
              <textarea
                className="scrollbar h-full w-full resize-none bg-transparent p-[16px] outline-none"
                placeholder="Lyrics Here"
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
              ></textarea>
            </div>

            <button
              className="mt-[16px] flex items-center gap-[4px] rounded-[8px] bg-green-500 px-[16px] py-[8px] font-medium hover:bg-green-400"
              onClick={handleSyncClick}
            >
              <Icon path={mdiSync} size={0.8} />
              <span>Sync</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EditLyricsPage;
