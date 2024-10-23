import { BaseApi } from '../BaseApi';

export class AudioApi extends BaseApi {
  public async getAudio(options: {
    link?: string;
    id?: string;
    type: 'full' | 'instrumental';
  }) {
    const response = await this.http.get('/audio', {
      params: options,
      responseType: 'arraybuffer',
    });

    return response.data;
  }
}
