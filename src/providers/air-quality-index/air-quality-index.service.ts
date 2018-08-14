import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AQI } from '../../models/aqi';
import { Observable } from 'rxjs';
import { AddressServer } from '../../models/addressServer.interface';


@Injectable()
export class AirQualityIndexProvider {

  constructor(public http: HttpClient) {

  }
  public getAQI(r : AddressServer, systemid : string): Observable<AQI> {
    const request = 'aqi.php?id=' + systemid;
    console.log('url', 'http://' + r.ip + ':' + r.port + '/' + request);
    return this.http.get<AQI>('http://' + r.ip + ':' + r.port + '/' + request);
  }

}
