export class ProcessInstrumentalAudioError extends Error {
  public message = "Cannot process instrumental audio";
}

export class GetVideoInfoError extends Error {
  constructor(link: string) {
    super(`Cannot get video info from link ${link}`);
  }
}

export class DownloadAudioError extends Error {
  constructor(link: string) {
    super(`Cannot download audio from link ${link}`);
  }
}
