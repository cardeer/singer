import { IsArray, IsString } from "class-validator";

export class UpsertLyricsRequestBody {
  @IsString()
  id: string;

  @IsArray()
  lyrics: [number, string][];
}
