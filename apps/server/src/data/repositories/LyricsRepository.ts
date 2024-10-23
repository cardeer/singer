import { Token } from "typedi";
import { ILyrics } from "../entities/ILyrics";
import { knex } from "../knex";

export class LyricsRepository {
  public async findById(id: string): Promise<ILyrics | undefined> {
    const result = await knex<ILyrics, ILyrics[]>("lyrics").first().where("id", id);
    return result;
  }
}

export const LyricsRepositoryIdentifier = new Token<LyricsRepository>();
