import { mdiMicrophone, mdiPencil } from '@mdi/js';
import Icon from '@mdi/react';
import { FC } from 'react';

const SelectPage: FC = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-black p-[16px]">
      <div className="w-full max-w-[500px] overflow-hidden border-b border-white p-[8px] text-white">
        <input
          className="w-full bg-transparent outline-none"
          placeholder="Video URL"
        />
      </div>

      <div className="mt-[32px] flex flex-col items-center gap-[16px]">
        <button className="flex w-full items-center gap-[4px] rounded-[8px] bg-green-300 px-[16px] py-[8px] font-medium hover:bg-green-200">
          <Icon path={mdiMicrophone} size={0.8} />
          <span>Ready</span>
        </button>

        <button className="flex h-[30px] items-center gap-[4px] rounded-[8px] bg-yellow-300 px-[16px] py-[8px] font-medium hover:bg-yellow-200">
          <Icon path={mdiPencil} size={0.8} />
          <span>Lyrics</span>
        </button>
      </div>
    </div>
  );
};

export default SelectPage;
