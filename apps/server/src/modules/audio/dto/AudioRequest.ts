import { IsEnum, IsString, ValidateIf } from "class-validator";

export enum GetAudioType {
  FULL = "full",
  INSTRUMENTAL = "instrumental",
}

export class GetAudioQueryParams {
  @IsString()
  @ValidateIf((o) => o.id === undefined || o.link)
  link: string;

  @IsString()
  @ValidateIf((o) => o.link === undefined || o.id)
  id: string;

  @IsString()
  @IsEnum(GetAudioType)
  type: "full" | "instrumental";
}
