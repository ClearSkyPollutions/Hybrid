import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { PM } from '../../models/pm';



@Injectable()
export class DataProvider {
 
  //TODO: get url from env.json file  
  private RaspServerUrl: string = 'http://192.168.2.69:8000';
  
  constructor(private http: HttpClient) {}

  public getLastMesure() {
    let requestConcPM = 'Concentration_pm?order=id,desc&page=1,1&transform=1'; 

    let requestTempHum = 'DHT22?order=id,desc&page=1,1&transform=1'; 
   

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

  getAllMesure(){
    let request = 'Concentration_pm?transform=1'; 
   
    return this.http.get<PM[]>(this.RaspServerUrl + '/' + request); 
  }

}
