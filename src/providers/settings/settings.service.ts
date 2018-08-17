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
        return this.http.get<Settings>('http://' + r.ip + ':' + r.port + '/' + request)
        .timeoutWith(2000, Observable.throw(new Error('Timeout Exceeded')));
  }

  public setConfig(s : Settings, r : AddressServer) :Observable<Object> {
    const request = 'config.php';
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put('http://' + r.ip + ':' + r.port + '/' + request, s, {headers})
    .timeoutWith(2000, Observable.throw(new Error('Timeout Exceeded')));
  }

  public getSystem(address : AddressServer) : Observable<any> {
    const requestID = 'SYSTEM?transform=1';
    return this.http.get<any>('http://' + address.ip + ':' + address.port + '/' + requestID)
    .timeoutWith(2000, Observable.throw(new Error('Timeout Exceeded')));
  }
}
