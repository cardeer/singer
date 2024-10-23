import { apiService } from '@/services';
import { useKaraokeStore } from '@/stores/karaokeStore';
import { mdiMicrophone, mdiPencil } from '@mdi/js';
import Icon from '@mdi/react';
import { useMutation } from '@tanstack/react-query';
import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SelectPage: FC = () => {
  const navigate = useNavigate();

  const [link, setLink] = useState<string>('');
  const setSongDetails = useKaraokeStore((state) => state.setSongDetails);

  const getSongDetailsMutation = useMutation({
    mutationFn: apiService.details.getSongDetails.mutation,
  });

  const handleLyricsClick = async () => {
    await getSongDetails();
    navigate('/lyrics');
  };

  const handleReadyClick = async () => {
    await getSongDetails();
    navigate('/karaoke');
  };

  const getSongDetails = async () => {
    try {
      const details = await getSongDetailsMutation.mutateAsync([link]);
      setSongDetails(details);
    } catch (error: unknown) {
      console.log(error);
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-black p-[16px]">
      <div className="w-full max-w-[500px] overflow-hidden border-b border-white p-[8px] text-white">
        <input
          className="w-full bg-transparent outline-none"
          placeholder="Video URL"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
      </div>

      <div className="mt-[32px] flex flex-col items-center gap-[16px]">
        <button
          className="flex w-full items-center gap-[4px] rounded-[8px] bg-green-300 px-[16px] py-[8px] font-medium hover:bg-green-200"
          onClick={handleReadyClick}
        >
          <Icon path={mdiMicrophone} size={0.8} />
          <span>Ready</span>
        </button>

        <button
          className="flex h-[30px] items-center gap-[4px] rounded-[8px] bg-yellow-300 px-[16px] py-[8px] font-medium hover:bg-yellow-200"
          onClick={handleLyricsClick}
        >
          <Icon path={mdiPencil} size={0.8} />
          <span>Lyrics</span>
        </button>
      </div>
    </div>
  );
};

export default SelectPage;
