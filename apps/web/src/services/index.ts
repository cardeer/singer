import axios from 'axios';
import { AudioApi } from './api/AudioApi';
import { DetailsApi } from './api/DetailsApi';
import { LyricsApi } from './api/LyricsApi';
import { WithMutation, withMutation } from './withMutation';

export class ApiService {
  public details: WithMutation<DetailsApi>;
  public audio: WithMutation<AudioApi>;
  public lyrics: WithMutation<LyricsApi>;

  constructor() {
    const http = axios.create({
      baseURL: 'http://localhost:3001',
    });

    this.details = withMutation(new DetailsApi(http));
    this.audio = withMutation(new AudioApi(http));
    this.lyrics = withMutation(new LyricsApi(http));
  }
}

export const apiService = new ApiService();
