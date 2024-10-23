import { BaseApi } from '../BaseApi';

export class LyricsApi extends BaseApi {
  public async updateLyrics(id: string, lyrics: [number, string][]) {
    const response = await this.http.post('/lyrics', {
      id,
      lyrics,
    });

    return response.data;
  }

  public async getLyrics(id: string) {
    const response = await this.http.get(`/lyrics/${id}`);
    return response.data;
  }
}
