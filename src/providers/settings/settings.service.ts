import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Settings } from '../../models/settings';
import { BASE_URL } from '../../env/env';
import { Observable } from 'rxjs';


@Injectable()
export class SettingsProvider {

  private RaspServerUrl: string = BASE_URL.url;

  constructor(public http: HttpClient) {
  }

  public getConfig() :Observable<Settings> {
    const request = 'config.json';
    return this.http.get<Settings>(this.RaspServerUrl + '/' + request);
  }

  public setConfig(s : Settings) :Observable<Object> {
    const request = 'config.php';
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.put(this.RaspServerUrl + '/' + request, s, {headers});
  }
}
