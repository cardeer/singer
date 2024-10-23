import { BaseApi } from '../BaseApi';

export class DetailsApi extends BaseApi {
  public async getSongDetails(link: string) {
    const response = await this.http.get('/details', {
      params: { link },
    });

    return response.data;
  }
}
