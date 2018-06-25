import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AQI } from '../../models/aqi';
import { URL } from '../../env/env';
import { Observable } from 'rxjs';


@Injectable()
export class AirQualityIndexProvider {

  private RaspServerUrl: string = URL.raspberryPi;
  constructor(public http: HttpClient) {

  }
  public getAQI(): Observable<AQI> {
    const request = 'aqi.php';

    return this.http.get<AQI>(this.RaspServerUrl + '/' + request);
  }

}
