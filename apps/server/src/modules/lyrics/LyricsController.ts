import { Get, HttpCode, JsonController, Param } from "routing-controllers";

@JsonController("/lyrics")
export class LyricsController {
  @Get("/:id")
  @HttpCode(200)
  public async getLyrics(@Param("id") id: string) {}
}
