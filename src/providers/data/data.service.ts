import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { PM, PM10, PM25 } from '../../models/pm';
import { Humidity } from '../../models/temphum';



@Injectable()
export class DataProvider {
 
  //TODO: get url from env.json file  
  private RaspServerUrl: string = 'http://192.168.2.69:8000';
  
  constructor(private http: HttpClient) {}

  public getLastMesure() {
    const requestConcPM = 'AVG_HOUR?order=id,desc&page=1,1&transform=1'; 

    const requestTempHum = 'DHT22?order=id,desc&page=1,1&transform=1'; 
   

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


  // public getPM10Mesure(){
  //   const request= 'Concentration_pm?columns=date,pm10&filter=date,bt,2015-05-18,2015-05-19&transform=1';
  //   return this.http.get<PM10[]>(this.RaspServerUrl + '/' + request).map( res => {
  //     return res['Concentration_pm'];
  //   });
  // }

  // public getPM25Mesure(){
  //   const request= 'Concentration_pm?columns=date,pm25&filter=date,bt,2015-05-18,2015-05-19&transform=1';
  //   return this.http.get<PM25[]>(this.RaspServerUrl + '/' + request).map( res => {
     
  //     return res['Concentration_pm'];
  //   });
  // }

  // public getHumidityMesure(){
  //   const request= 'DHT22?columns=date,humidity&filter=date,bt,2015-05-18,2015-05-19&transform=1';
  //   return this.http.get<Humidity[]>(this.RaspServerUrl + '/' + request).map( res => {
     
  //     return res['DHT22'];
  //   });
  // }

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
      } // AVG_YEAR
      default: { 
        range= 5;
        break; 
      } 
   } 
    const request= tableName + '?columns=date,' + PollutantType + '&order=id,desc&page=1,' + range + '&transform=1';
    console.log(request);

    return this.http.get(this.RaspServerUrl + '/' + request).map( res => {
     
      return res[tableName];
    });
  }

/**
 * Table AVG_DAY
COLUMN date,pm25,pm10,temperature,humidity
Table AVG_MONTH
COLUMN date,pm25,pm10,temperature,humidity
Table AVG_YEAR
COLUMN date,pm25,pm10,temperature,humidity
 */
 
}
