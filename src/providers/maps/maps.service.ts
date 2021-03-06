import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Card } from 'ionic-angular';
import _ from 'lodash';
import { DataMapConstValues, DataMap, DataMapFactorized } from '../../models/dataMaps.interface';
import { AddressServer } from '../../models/addressServer.interface';

@Injectable()
export class MapsProvider {

  constructor(private http: HttpClient) { }

  public getDataSensorLocation(s : AddressServer): Observable<DataMapFactorized[]> {
    const tableName = 'MAP';
    const requestDataSensorLocation = tableName + '?transform=1';
    let dataMap: DataMap[] = [];
    const dataMapFactoArray: DataMapFactorized[] = [];
    return this.http.get<DataMapFactorized[]>('http://' + s.ip + ':' + s.port + '/'
    + requestDataSensorLocation).map((res: Object) => {
      dataMap = res[tableName];
      const constValues: DataMapConstValues[] = [];

      // Get all const
      dataMap.forEach((dataMap: DataMap) => {
        if ( !_.find(constValues, function(constValue: DataMapConstValues): boolean { return constValue.system === dataMap.system; })) {
          constValues.push({
            date     :  new Date(dataMap.date),
            system   :  dataMap.system,
            latitude :  dataMap.latitude,
            longitude:  dataMap.longitude
          });
        }
      });

      // Init data factorized
      constValues.forEach((constValue: DataMapConstValues) => {
        dataMapFactoArray.push({
          date     : constValue.date,
          values   : [],
          system   : constValue.system,
          latitude : constValue.latitude,
          longitude: constValue.longitude
        });
      });

      // Merge data by system name
      dataMap.forEach((dataMap: DataMap) => {
        const dataMapFacto = _.find(dataMapFactoArray, function(dataMapFacto: DataMapFactorized): boolean {
          return dataMapFacto.system === dataMap.system;
        });
        dataMapFacto.values.push({
          sensor   : dataMap.sensor,
          pollutant: dataMap.pollutant,
          value    : dataMap.value,
          unit     : dataMap.unit
        });
      });

      return dataMapFactoArray;
    });
  }

}
