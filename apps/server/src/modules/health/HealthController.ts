import { Get, HttpCode, JsonController } from "routing-controllers";
import { Service } from "typedi";

@JsonController("/health")
@Service()
export class HealthController {
  @Get("/")
  @HttpCode(200)
  public async ping() {
    return { message: "OK" };
  }
}
