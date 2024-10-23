import { INTERNAL_SERVER_ERROR_MESSAGE } from "@/constants/errors";
import { Get, HttpCode, InternalServerError, JsonController, NotFoundError, Param } from "routing-controllers";
import Container, { Service } from "typedi";
import { LyricsService } from "./LyricsService";
import { LyricsNotFoundError } from "./errors/LyricsError";

@JsonController("/lyrics")
@Service()
export class LyricsController {
  @Get("/:id")
  @HttpCode(200)
  public async getLyricsById(@Param("id") id: string) {
    const service = Container.get(LyricsService);

    try {
      const result = await service.getLyricsById(id);
      return result;
    } catch (error) {
      console.log("[LyricsController#getLyricsById]", error);

      if (error instanceof LyricsNotFoundError) {
        throw new NotFoundError(error.message);
      }

      throw new InternalServerError(INTERNAL_SERVER_ERROR_MESSAGE);
    }
  }
}
