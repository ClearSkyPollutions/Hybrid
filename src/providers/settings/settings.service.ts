import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Settings } from '../../models/settings';
import { URL } from '../../env/env';
import { Observable } from 'rxjs';


@Injectable()
export class SettingsProvider {

  private RaspServerUrl: string = URL.raspberryPi;

  constructor(public http: HttpClient) {
  }

  public getConfig() :Observable<Settings> {
    const request = 'config.json';
    return this.http.get<Settings>(this.RaspServerUrl + '/' + request);
  }

  public setConfig(s : Settings) :Observable<Object> {
    const request = 'config.php';

    return this.http.put(this.RaspServerUrl + '/' + request, JSON.stringify(s));
  }
}
