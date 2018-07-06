import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AQI } from '../../models/aqi';
import { URL } from '../../env/env';
import { Observable } from 'rxjs';


@Injectable()
export class AirQualityIndexProvider {

  private RaspServerIP: string = URL.raspberryPi.ipAddress;
  private RaspServerPort: string = URL.raspberryPi.port;
  constructor(public http: HttpClient) {

  }
  public getAQI(): Observable<AQI> {
    const request = 'aqi.php';

    return this.http.get<AQI>('http://' + this.RaspServerIP + ':' + this.RaspServerPort + '/' + request);
  }

}
