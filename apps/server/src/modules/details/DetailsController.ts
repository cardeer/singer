import { INTERNAL_SERVER_ERROR_MESSAGE } from "@/constants/errors";
import { Get, InternalServerError, JsonController, QueryParams } from "routing-controllers";
import Container, { Service } from "typedi";
import { DetailsService } from "./DetailsService";
import { GetSongDetailsQueryParams } from "./dto/DetailsRequest";

@JsonController("/details")
@Service()
export class DetailsController {
  @Get("/")
  public async getSongDetails(@QueryParams() request: GetSongDetailsQueryParams) {
    const service = Container.get(DetailsService);

    try {
      const result = await service.getSongDetails(request.link);
      return result;
    } catch {
      throw new InternalServerError(INTERNAL_SERVER_ERROR_MESSAGE);
    }
  }
}
