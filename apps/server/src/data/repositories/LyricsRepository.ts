import { Token } from "typedi";
import { ILyrics } from "../entities/ILyrics";
import { knex } from "../knex";

export class LyricsRepository {
  public async findById(id: string): Promise<ILyrics | undefined> {
    const result = await knex<ILyrics, ILyrics[]>("lyrics").first().where("id", id);
    return result;
  }

  public async upsertLyrics(lyrics: ILyrics) {
    const currentLyrics = await knex<ILyrics>("lyrics").first().where("id", lyrics.id);

    if (currentLyrics) {
      await knex<ILyrics>("lyrics").update(lyrics).where("id", lyrics.id);
      return;
    }

    await knex<ILyrics>("lyrics").insert(lyrics);
  }
}

export const LyricsRepositoryIdentifier = new Token<LyricsRepository>();
