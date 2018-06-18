import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Settings } from '../../models/settings';


@Injectable()
export class SettingsProvider {

  //TODO: get url from env.json file  
  private RaspServerUrl: string = 'http://192.168.2.118:7000';
  
  constructor(public http: HttpClient) {
  }

  public getConfig(){
    const request = 'config.json';
   
    return this.http.get<Settings>(this.RaspServerUrl + '/' + request);
  }

  public setConfig(s : Settings){
    const request = 'config.php'
    const headers = new HttpHeaders().set("Content-Type", "application/json");

    return this.http.put(this.RaspServerUrl + '/' + request, s, {headers});
  }
}
