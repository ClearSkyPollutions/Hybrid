import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Data } from '../../models/data.interface';

const DATABASE_FILE_NAME: string = 'data.db';

@Injectable()
export class SqliteProvider {

  private sqliteDb: SQLiteObject;

  constructor(public http: HttpClient, private sqlite: SQLite) {
    this.createSQLiteDatabase();
  }

  private createSQLiteDatabase(): void {
    this.sqlite.create({
      name: 'DATABASE_FILE_NAME', // if database file already exists -> db will be opened
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        console.log('SQLite database created');
        this.sqliteDb = db;
        this.createTables();

      })
      .catch(e => console.log(e));
  }

  private createTables(): void {
    //TODO: optimise creation of tables
    this.sqliteDb.executeSql('create table IF NOT EXISTS danceMoves(name VARCHAR(32))', {})
    .then(() => console.log('Executed SQL'))
    .catch(e => console.log(e));
  }

  requestData(tableName: string, PollutantType: string)  {
   const range = this.getRangeFromTableName(tableName);
   const request = 'SELECT date, ' + PollutantType + 'FROM ' + tableName + ' ORDER BY date DESC LIMIT ' + range;
   console.log(request);
   return this.sqliteDb.executeSql(request, {})
   .then((data) => {

    if (data == null) {
      return [];
    }
    if (data.rows.length > 0) {
      const mesures : Data[] = [];
      for (var i = 0; i < data.rows.length; i++) {
        mesures.push(data.rows.item(i));
      }
      console.log(mesures);
    }
   });
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
}
