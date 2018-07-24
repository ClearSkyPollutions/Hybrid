import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Settings } from '../../models/settings';
import { Observable } from 'rxjs';
import { AddressServer } from '../../models/addressServer.interface';


@Injectable()
export class SettingsProvider {

  constructor(public http: HttpClient) {
  }

  public getConfig(r : AddressServer) :Observable<Settings> {
    const request = 'config.json';
        return this.http.get<Settings>('http://' + r.ip + ':' + r.port + '/' + request);
  }

  public setConfig(s : Settings, r : AddressServer) :Observable<Object> {
    const request = 'config.php';
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put('http://' + r.ip + ':' + r.port + '/' + request, s, {headers});
  }
}
