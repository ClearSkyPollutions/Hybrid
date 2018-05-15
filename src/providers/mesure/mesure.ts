import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Mesure } from '../../models/mesure';

@Injectable()
export class MesureProvider {
 
  // TODO : get url from env.json file  
  RaspServerUrl: string = 'http://192.168.2.108:4002';
  
  constructor(public http: HttpClient) {
    console.log('Hello MesureProvider Provider');
  }

  getLastMesure(){
    let request = 'Concentration_pm?order=id,desc&page=1,1&transform=1'; // 'Concentration_pm/1';
    // even if it's a unique value, the php api return an array with one value
    return this.http.get<Mesure[]>(this.RaspServerUrl + '/' + request); 
  }

}
