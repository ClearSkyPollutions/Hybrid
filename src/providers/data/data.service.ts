import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { PM } from '../../models/pm';




@Injectable()
export class DataProvider {
 
  //TODO: get url from env.json file  
  private RaspServerUrl: string = 'http://192.168.2.118:8000';
  
  constructor(private http: HttpClient) {}

  public getLastMesure() {
    const requestConcPM = 'AVG_HOUR?order=date,desc&page=1,1&transform=1'; 

    const requestTempHum = 'DHT22?order=date,desc&page=1,1&transform=1'; 
   

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

  public getAllMesure(){
    const request = 'AVG_HOUR?transform=1'; 
   
    return this.http.get<PM[]>(this.RaspServerUrl + '/' + request); 
  }


  public defineDataForChart(tableName: string, PollutantType: string ){
    let range: number;
    switch(tableName) { 
      case 'AVG_HOUR': { 
         range= 24;
         break; 
      } 
      case 'AVG_DAY': { 
         range= 31;
         break; 
      } 
      case 'AVG_MONTH': { 
        range= 12;
        break; 
      } 
      default: { // AVG_YEAR
        range= 5;
        break; 
      } 
   } 
    const request= tableName + '?columns=date,' + PollutantType + '&order=date,desc&page=1,' + range + '&transform=1';
    //console.log(request);

    return this.http.get(this.RaspServerUrl + '/' + request).map( res => {
     
      return res[tableName];
    });
  }


}
