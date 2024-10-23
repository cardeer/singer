import { INTERNAL_SERVER_ERROR_MESSAGE } from "@/constants/errors";
import {
  Body,
  Get,
  HttpCode,
  InternalServerError,
  JsonController,
  NotFoundError,
  Param,
  Post,
} from "routing-controllers";
import Container, { Service } from "typedi";
import { LyricsService } from "./LyricsService";
import { UpsertLyricsRequestBody } from "./dto/LyricsRequest";
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

  @Post("/")
  @HttpCode(200)
  public async upsertLyrics(@Body() body: UpsertLyricsRequestBody) {
    const service = Container.get(LyricsService);

    try {
      await service.upsertLyrics(body.id, body.lyrics);
      return {};
    } catch (error) {
      console.log("[LyricsController#upsertLyrics]", error);

      throw new InternalServerError(INTERNAL_SERVER_ERROR_MESSAGE);
    }
  }
}
