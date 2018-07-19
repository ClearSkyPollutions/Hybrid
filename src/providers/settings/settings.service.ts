import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Settings } from '../../models/settings';
import { URL } from '../../env/env';
import { Observable } from 'rxjs';
import { AddressServer } from '../../models/addressServer.interface';


@Injectable()
export class SettingsProvider {

  constructor(public http: HttpClient) {
  }

  public getConfig() :Observable<Settings> {
    const request = 'config.json';
    return this.http.get<Settings>('http://' + URL.raspberryPi.ip + ':' + URL.raspberryPi.port + '/' + request);
  }

  public setConfig(s : Settings, r : AddressServer) :Observable<Object> {
    const request = 'config.php';
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    URL.raspberryPi.ip = r.ip;
    URL.raspberryPi.port = r.port;
    URL.server.ip = s.serverAddress.ip;
    URL.server.port = s.serverAddress.port;
    return this.http.put('http://' + URL.raspberryPi.ip + ':' + URL.raspberryPi.port + '/' + request, s, {headers});
  }
}
