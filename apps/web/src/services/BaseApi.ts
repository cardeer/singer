import { Axios } from 'axios';

export class BaseApi {
  protected http: Axios;

  constructor(http: Axios) {
    this.http = http;
  }
}
