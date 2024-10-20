export function getKaraokeCommand(
  inputFile: string = 'audio.mp3',
  outputFile: string = 'karaoke.mp3',
): string[] {
  return [
    '-i',
    inputFile,
    '-af',
    'pan=stereo|c0=c0|c1=-1*c1',
    '-ac',
    '1',
    outputFile,
  ];
}
