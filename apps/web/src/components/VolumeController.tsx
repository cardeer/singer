import React, { FC, useState } from 'react';

interface IVolumeControllerProps {
  onVolumeChange(volume: number): void;
}

const VolumeController: FC<IVolumeControllerProps> = ({ onVolumeChange }) => {
  const [volume, setVolume] = useState<number>(
    localStorage.getItem('volume')
      ? parseInt(localStorage.getItem('volume')!)
      : 50,
  );

  const handleDrag = () => {};

  const handleWheel = (e: React.WheelEvent) => {
    const scale = -e.deltaY * 0.05;
    let newVolume = volume + scale;

    if (newVolume > 100) {
      newVolume = 100;
    } else if (newVolume < 0) {
      newVolume = 0;
    }

    localStorage.setItem('volume', newVolume.toString());

    setVolume(newVolume);
    onVolumeChange(newVolume);
  };

  return (
    <div
      className="relative block h-[20px] w-[100px] cursor-pointer border border-white"
      onWheel={handleWheel}
    >
      <div
        className="absolute left-0 top-0 h-full w-full bg-white"
        style={{
          width: `${volume}%`,
        }}
      ></div>
    </div>
  );
};

export default VolumeController;
