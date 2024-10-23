import { INTERNAL_SERVER_ERROR_MESSAGE } from "@/constants/errors";
import { sendFile } from "@/utils/server";
import { Response } from "express";
import {
  Get,
  HttpCode,
  InternalServerError,
  JsonController,
  NotFoundError,
  QueryParams,
  Res,
} from "routing-controllers";
import Container, { Service } from "typedi";
import { AudioService } from "./AudioService";
import { GetAudioQueryParams } from "./dto/AudioRequest";
import { DownloadAudioError, GetVideoInfoError, ProcessInstrumentalAudioError } from "./error/AudioError";

@JsonController("/audio")
@Service()
export class AudioController {
  @Get("/")
  @HttpCode(200)
  public async getAudio(@QueryParams() params: GetAudioQueryParams, @Res() res: Response) {
    const service = Container.get(AudioService);

    try {
      const result = await service.getAudio(params);
      await sendFile(res, result);

      return res;
    } catch (error: unknown) {
      console.log("[AudioController#getAudio]", error);

      if (error instanceof GetVideoInfoError) {
        throw new NotFoundError(error.message);
      }

      if (error instanceof ProcessInstrumentalAudioError || error instanceof DownloadAudioError) {
        throw new InternalServerError(error.message);
      }

      throw new InternalServerError(INTERNAL_SERVER_ERROR_MESSAGE);
    }
  }
}
