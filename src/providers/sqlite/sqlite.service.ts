// core
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { Storage } from '@ionic/storage';

// Interfaces
import { Data } from '../../models/data.interface';
import { Type } from '../../models/type.interface';

// Config
import { SQLITE_REQ } from '../../configs/sqlite.req';
import { TYPES } from '../../configs/types.data';
import { BASE_URL } from '../../env/env';



const DATABASE_FILE_NAME: string = 'data.db';

@Injectable()
export class SqliteProvider {

  private sqliteDb: SQLiteObject;
  private RaspServerUrl: string = BASE_URL.url;
  private measurements : Data[] = [];
  private  types : Type[] = TYPES;

  constructor(
    private http        : HttpClient,
    private sqlite      : SQLite,
    private sqlitePorter: SQLitePorter,
    private storage     : Storage
  ) {
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
      this.storage.get('tables_created').then((val: boolean) => {
        if (val) {
          console.log('tables already created !');
        } else {
          this.createTables();
        }
      });

    })
    .catch((e :any) => console.log(e));
  }


  private requestDataForChart(tableName: string, PollutantType: string): Promise<any> {
   const range = this.getRangeFromTableName(tableName);
   const request = 'SELECT t1.date, t1.value FROM ' + tableName + ' t1 INNER JOIN TYPE t2 ON t1.type=t2.id WHERE t2.name = "' + PollutantType + '" ORDER BY t1.date DESC LIMIT ' + range + ';';
   console.log(request);
   return this.sqliteDb.executeSql(request, {})
   .then((data:any) => {
    if (data.rows.length > 0) {
      for (var i = 0; i < data.rows.length; i++) {
        this.measurements.push(data.rows.item(i));
      }
      console.log(this.measurements);
      return this.measurements;
    }
   })
   .catch((e:any) => console.log(e));
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

  private createTables(): void {
  this.sqlitePorter.importSqlToDb(this.sqliteDb, SQLITE_REQ.sql)
    .then((data:any) => {
      console.log('tables created successfully');
      this.storage.set('tables_created', true);
      //this.requestDataForChart('AVG_HOUR', 'pm10');
    })
    .catch((e: any) => console.error(e));
  }

  private synchroniseTable(tableName: string): void {
    this.getLastDate(tableName).then((date:string) => {
      const request = tableName + '?filter=Date,gt,"' + date +  '"&transform=1';
      console.log('url', this.RaspServerUrl + '/' + request);
      this.http.get(this.RaspServerUrl + '/' + request)
      .map( (res :Object) => {
        res = res[tableName];
        console.log(res);
        this.insertNewValuesIntoDb(tableName, res).then(res => console.log(res));
      }).toPromise().catch((err: any) => {
        console.log('error', err);
      });
    });
  }

  private insertNewValuesIntoDb(tableName: string, data : any) {
    let request = 'INSERT INTO ' + tableName + ' (Date, Value, Type) VALUES ';
    console.log('length', data.length);
    for (var i = 0; i < data.length - 1; i++) {
       request = request + '("' + data[i].Date + '", ' + data[i].Value + ', ' + data[i].Type + '), ';
    }
    request = request + '("' + data[i].Date + '", ' + data[i].Value + ', ' + data[i].Type + ' ); ';

    return this.sqliteDb.executeSql(request, {})
    .then((res: any) => {

      console.log(res);
      return res;
    })
    .catch((e :any) => {
      console.log(e);
    });
  }

  private getLastDate(tableName: string): Promise<string> {
    const requestDate = 'SELECT date FROM ' + tableName + ' ORDER BY date DESC LIMIT 1';
    return this.sqliteDb.executeSql(requestDate, {})
    .then((data:any) => {
     if (data.rows.length > 0) {
      return data.rows.item(0).date;
       }
    })
    .catch((e :any) => console.log(e));
  } // return '' sinon

  public synchroniseAllDatabase(): void {
      this.synchroniseTable('AVG_HOUR');
      // this.synchroniseTable('AVG_MONTH');
      // this.synchroniseTable('AVG_DAY');
      // this.synchroniseTable('AVG_YEAR');
  }
}
