import React, { ChangeEvent, FC, useState } from 'react';
import style from './style.module.css';

interface IVolumeControllerProps {
  onVolumeChange(volume: number): void;
}

const VolumeController: FC<IVolumeControllerProps> = ({ onVolumeChange }) => {
  const [volume, setVolume] = useState<number>(
    localStorage.getItem('volume')
      ? parseFloat(localStorage.getItem('volume')!) * 100
      : 50,
  );

  const handleVolumeInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    localStorage.setItem('volume', (value / 100).toString());

    setVolume(value);
    onVolumeChange(value / 100);
  };

  const handleWheel = (e: React.WheelEvent) => {
    const scale = -e.deltaY * 0.05;
    let newVolume = volume + scale;

    if (newVolume > 100) {
      newVolume = 100;
    } else if (newVolume < 0) {
      newVolume = 0;
    }

    localStorage.setItem('volume', (newVolume / 100).toString());

    setVolume(newVolume);
    onVolumeChange(newVolume / 100);
  };

  return (
    <input
      className={`${style['range-input']} w-[100px]`}
      type="range"
      value={volume}
      min={0}
      max={100}
      step={1}
      onChange={handleVolumeInputChange}
      onWheel={handleWheel}
    />
  );
};

export default VolumeController;
