export function getKaraokeCommand(
  input: string = 'audio.mp3',
  output: string = 'karaoke.mp3',
): string[] {
  return ['-i', input, '-af', 'pan=stereo|c0=c0|c1=-1*c1', '-ac', '1', output];
}
