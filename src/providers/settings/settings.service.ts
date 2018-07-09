import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Settings } from '../../models/settings';
import { URL } from '../../env/env';
import { Observable } from 'rxjs';


@Injectable()
export class SettingsProvider {

  constructor(public http: HttpClient) {
    console.log(URL.raspberryPi.port);
  }

  public getConfig() :Observable<Settings> {
    const request = 'config.json';
    return this.http.get<Settings>('http://' + URL.raspberryPi.ip + ':' + URL.raspberryPi.port + '/' + request);
  }

  public setConfig(s : Settings) :Observable<Object> {
    const request = 'config.php';
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    URL.raspberryPi.ip = s.raspberryPiAddress.ip;
    URL.raspberryPi.port = s.raspberryPiAddress.port;
    URL.server.ip = s.serverAddress.ip;
    URL.server.port = s.serverAddress.port;
    console.log(s);
    return this.http.put('http://' + s.raspberryPiAddress.ip + ':' + s.raspberryPiAddress.port + '/' + request, s, {headers});
  }
}
