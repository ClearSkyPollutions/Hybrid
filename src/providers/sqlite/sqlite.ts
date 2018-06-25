import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { Data } from '../../models/data.interface';
import { Storage } from '@ionic/storage';
import { SQLITE_REQ } from '../../configs/sqlite.req';
import { URL } from '../../env/env';



const DATABASE_FILE_NAME: string = 'data.db';

@Injectable()
export class SqliteProvider {

  private sqliteDb: SQLiteObject;
  private RaspServerUrl: string = URL.raspberryPi;

  constructor(public http: HttpClient, private sqlite: SQLite, public sqlitePorter: SQLitePorter, private storage: Storage) {
    console.log('sqlite provider loaded ');
    this.createSQLiteDatabase();
  }

  createSQLiteDatabase(): void {
    this.sqlite.create({
      name: DATABASE_FILE_NAME, // if database file already exists -> db will be opened
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        this.sqliteDb = db;
        this.storage.get('tables_created').then(val => {
          if (val) {
            console.log('tables already created !');
            this.synchroniseDatabase('AVG_HOUR');
          } else {
            this.createTables();
          }
        });

      })
      .catch(e => console.log(e));
  }


  private requestDataForChart(tableName: string, PollutantType: string)  {
   const range = this.getRangeFromTableName(tableName);
   const request = 'SELECT t1.date, t1.value FROM ' + tableName + ' t1 INNER JOIN TYPE t2 ON t1.type=t2.id WHERE t2.name = "' + PollutantType + '" ORDER BY t1.date DESC LIMIT ' + range + ';';
   console.log(request);
   return this.sqliteDb.executeSql(request, {})
   .then((data) => {
    if (!data) {
      return [];
    }
    if (data.rows.length > 0) {
      const mesures : Data[] = [];
      for (var i = 0; i < data.rows.length; i++) {
        mesures.push(data.rows.item(i));
      }
      console.log(mesures);
      return mesures;
    }
   }).catch(e => console.log(e));
  }

  private getRangeFromTableName(tableName: string) : number {
    switch (tableName) {
      case 'AVG_HOUR':
        return 24;
      case 'AVG_DAY':
        return 31;
      case 'AVG_MONTH':
        return 12;
      default:
        return 5;
    }
  }

  private insertNewType():void {

  }


  private createTables(): void {
  this.sqlitePorter.importSqlToDb(this.sqliteDb, SQLITE_REQ.sql)
          .then(data => {
            console.log('tables created successfully');
            this.storage.set('tables_created', true);
            this.requestDataForChart('AVG_HOUR', 'pm10');
          })
          .catch(e => console.error(e));
  }

  public synchroniseDatabase(tableName: string) :void {
     this.getLastDate(tableName).then((resp) => {
       let date = resp.date;
       console.log(date);
        const request = tableName + '?filter=date,gt,' + date +  '&transform=1';
        return this.http.get(this.RaspServerUrl + '/' + request).map( res => {
          console.log(res);
          console.log(res[tableName]);
        });
      });
  }

  private getLastDate(tableName: string) {
    const requestDate = 'SELECT date FROM ' + tableName + ' ORDER BY date DESC LIMIT 1';
    return this.sqliteDb.executeSql(requestDate, {})
    .then((data) => {
     if (data == null) {
       console.log('no data !');
       return [];
     }
     if (data.rows.length > 0) {
       const lastDate = [];
       for (var i = 0; i < data.rows.length; i++) {
         lastDate.push(data.rows.item(i));
       }
       return lastDate[0];
     }
  }).catch(e => console.log(e));
}


}
