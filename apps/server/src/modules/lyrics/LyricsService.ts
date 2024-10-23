import { ILyrics } from "@/data/entities/ILyrics";
import { LyricsRepository, LyricsRepositoryIdentifier } from "@/data/repositories/LyricsRepository";
import { Inject, Service } from "typedi";
import { LyricsNotFoundError } from "./errors/LyricsError";

@Service()
export class LyricsService {
  @Inject(LyricsRepositoryIdentifier)
  private _lyricsRepository: LyricsRepository;

  public async getLyricsById(id: string) {
    const result = await this._lyricsRepository.findById(id);

    if (!result) {
      throw new LyricsNotFoundError(id);
    }

    result.lyrics = JSON.parse(result.lyrics);
    return result;
  }

  public async upsertLyrics(id: string, lyrics: [number, string][]) {
    const now = new Date();

    const entity: ILyrics = {
      id,
      lyrics: JSON.stringify(lyrics),
      created_at: now,
      updated_at: now,
    };

    await this._lyricsRepository.upsertLyrics(entity);
  }
}
