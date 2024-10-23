import { IsString } from "class-validator";

export class GetSongDetailsQueryParams {
  @IsString()
  link: string;
}
