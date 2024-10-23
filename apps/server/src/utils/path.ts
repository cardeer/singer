import fs from "fs";
import path from "path";

export function getSoundIdDir(id: string): string {
  const soundsDir = path.resolve(process.cwd(), "sounds");

  if (!fs.existsSync(soundsDir)) {
    fs.mkdirSync(soundsDir);
  }

  const dir = path.resolve(soundsDir, id);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  return dir;
}

export function getFullAudioFileName(id: string): string {
  const dir = getSoundIdDir(id);
  return path.resolve(dir, "audio.mp3");
}

export function findFullAudioFile(id: string): string | null {
  const dir = getSoundIdDir(id);
  const audioFile = path.resolve(dir, "audio.mp3");

  if (fs.existsSync(audioFile)) {
    return audioFile;
  }

  return null;
}

export function getInstrumentalDir(id: string): string {
  const dir = path.resolve(getSoundIdDir(id), "instrumental");

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  return dir;
}

export function findInstrumentalFile(id: string): string | null {
  const dir = getInstrumentalDir(id);
  const files = fs.readdirSync(dir);

  if (files.length > 0) {
    return path.resolve(dir, files[0]);
  }

  return null;
}
