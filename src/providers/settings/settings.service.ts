import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Settings } from '../../models/settings';
import { URL } from '../../env/env';
import { Observable } from 'rxjs';


@Injectable()
export class SettingsProvider {

  private RaspServerIP: string = URL.raspberryPi.ipAddress;
  private RaspServerPort: string = URL.raspberryPi.port;

  constructor(public http: HttpClient) {
  }

  public getConfig() :Observable<Settings> {
    const request = 'config.json';
    return this.http.get<Settings>(this.RaspServerIP + '/' + request);
  }

  public setConfig(s : Settings) :Observable<Object> {
    const request = 'config.php';
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.put('http://' + this.RaspServerIP + ':' + this.RaspServerPort + '/' + request, s, {headers});
  }

}
