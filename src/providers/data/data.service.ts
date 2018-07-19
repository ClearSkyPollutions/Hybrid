import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL } from '../../env/env';




@Injectable()
export class DataProvider {
  private RaspServerIP: string = URL.raspberryPi.ip;
  private RaspServerPort: string = URL.raspberryPi.port;
  constructor(private http: HttpClient) {}

  public getLastMesure() :Observable<any> {
    const requestConcPM = 'AVG_HOUR?order=date,desc&page=1,1&transform=1';

    const requestTempHum = 'DHT22?order=date,desc&page=1,1&transform=1';

    return Observable.forkJoin([
      this.http.get('http://' + this.RaspServerIP + ':' + this.RaspServerPort + '/' + requestConcPM),
      this.http.get('http://' + this.RaspServerIP + ':' + this.RaspServerPort + '/' + requestTempHum)
    ])
    .map((data: any) => ({
        pm : data[0],
        temphum : data[1]
      })
    );
  }



  public defineDataForChart(tableName: string, PollutantType: string) :Observable<any> {
    let range: number;
    switch (tableName) {
      case 'AVG_HOUR': {
         range = 24;
         break;
      }
      case 'AVG_DAY': {
         range = 31;
         break;
      }
      case 'AVG_MONTH': {
        range = 12;
        break;
      }
      default: { // AVG_YEAR
        range = 5;
        break;
      }
   }
    const request = tableName + '?columns=date,' + PollutantType + '&order=date,desc&page=1,' + range + '&transform=1';
    return this.http.get('http://' + this.RaspServerIP + ':' + this.RaspServerPort + '/' + request).map( (res : Object) =>
      res[tableName]
    );
  }

}
