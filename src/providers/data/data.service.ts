import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Data } from '../../models/data.interface';


@Injectable()
export class DataProvider {
 
  // TODO: get url from env.json file  
  private RaspServerUrl: string = 'http://192.168.2.118:8000';
  
  constructor(private http: HttpClient) {}

  public getLastMesure() {
    let requestConcPM = 'SDS011?order=date,desc&page=1,1&transform=1'; // 'Concentration_pm/1';
    // even if it's a unique value, the php api return an array with one value

    let requestTempHum = 'DHT22?order=date,desc&page=1,1&transform=1'; // 'TempHum/1';
    // even if it's a unique value, the php api return an array with one value

    return Observable.forkJoin([
      this.http.get(this.RaspServerUrl + '/' + requestConcPM),
      this.http.get(this.RaspServerUrl + '/' + requestTempHum)
    ])
    .map((data: any[]) => {
      return {
        pm : data[0],
        temphum : data[1]
      };
    }); 
  }
}
