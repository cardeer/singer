export class LyricsNotFoundError extends Error {
  constructor(id: string) {
    super(`Lyrics with the given id ${id} cannot be found`);
  }
}
