import { BaseApi } from '../BaseApi';

export class LyricsApi extends BaseApi {
  public async getLyrics(id: string) {
    const response = await this.http.get(`/lyrics/${id}`);
    return response.data;
  }
}
