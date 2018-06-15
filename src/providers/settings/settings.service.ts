import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Settings } from '../../models/settings';
import { BASE_URL } from '../../env/env';


@Injectable()
export class SettingsProvider {

  private RaspServerUrl: string = BASE_URL.url;

  constructor(public http: HttpClient) {
  }

  public getConfig() {
    const request = 'config.json';
    return this.http.get<Settings>(this.RaspServerUrl + '/' + request);
  }

  public setConfig(s : Settings) {
    const request = 'config.php';

    return this.http.put(this.RaspServerUrl + '/' + request, JSON.stringify(s));
  }
}
