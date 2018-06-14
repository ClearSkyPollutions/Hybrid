import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Data } from '../../models/data.interface';

const DATABASE_FILE_NAME: string = 'data.db';

@Injectable()
export class SqliteProvider {

  private sqliteDb: SQLiteObject;

  constructor(public http: HttpClient, private sqlite: SQLite) {
    console.log('sqlite provider loaded ');
    this.createSQLiteDatabase();
  }

  createSQLiteDatabase(): void {
    this.sqlite.create({
      name: DATABASE_FILE_NAME, // if database file already exists -> db will be opened
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
    this.sqliteDb.executeSql('CREATE TABLE TYPE (id integer PRIMARY KEY AUTOINCREMENT, name string,sensor string);', {})
    .then(() => {
      console.log('TYPE table created');
      this.sqliteDb.executeSql('INSERT INTO TYPE(name,sensor) VALUES("pm25", "SDS011"),("pm10", "SDS011"),("temperature", "DHT22"),("humidity", "DHT22");', {})
      .then(() => {
        console.log('types inserted');
        this.getDataForChart();
      })
      .catch(e => console.log(e));
    })
    .catch(e => console.log(e));

    this.sqliteDb.executeSql('CREATE TABLE IF NOT EXISTS AVG_HOUR (date datetime, value float, type integer, FOREIGN KEY(type) REFERENCES Type(id), PRIMARY KEY (date, type));', {})
    .then(() => console.log('AVG_HOUR table created'))
    .catch(e => console.log(e));

    this.sqliteDb.executeSql('CREATE TABLE IF NOT EXISTS AVG_DAY (date datetime, value float, type integer, FOREIGN KEY(type) REFERENCES Type(id), PRIMARY KEY (date, type));', {})
    .then(() => console.log('AVG_DAY table created'))
    .catch(e => console.log(e));

    this.sqliteDb.executeSql('CREATE TABLE IF NOT EXISTS AVG_MONTH (date datetime, value float, type integer, FOREIGN KEY(type) REFERENCES Type(id), PRIMARY KEY (date, type));', {})
    .then(() => console.log('AVG_MONTH table created'))
    .catch(e => console.log(e));

    this.sqliteDb.executeSql('CREATE TABLE IF NOT EXISTS AVG_YEAR (date datetime, value float, type integer, FOREIGN KEY(type) REFERENCES Type(id), PRIMARY KEY (date, type));', {})
    .then(() => console.log('AVG_YEAR table created'))
    .catch(e => console.log(e));
    // this.sqliteDb.executeSql('CREATE TABLE IF NOT EXISTS AVG_HOUR (date datetime, value float, type integer, FOREIGN KEY(type) REFERENCES Type(id), PRIMARY KEY (date, type));', {})
    // .then(() => {
    //   console.log('Executed SQL');
    //   this.sqliteDb.executeSql("INSERT INTO `AVG_HOUR`(date, value, type) VALUES ('2018-11-31 00:00:00','17.41', 3 )", {})
    //     .then(() => {
    //       console.log('PM10 data inserted !');
    //       this.getDataForChart();
    //     })
    //     .catch(e => console.log(e));
    // })
    // .catch(e => console.log(e));
  }

  private getDataForChart(): void {
   this.requestData('TYPE', '');
  }

  private requestData(tableName: string, PollutantType: string)  {
   const range = this.getRangeFromTableName(tableName);
   const request = 'SELECT * FROM ' + tableName;
   console.log(request);
   return this.sqliteDb.executeSql(request, {})
   .then((data) => {
    console.log('trying to read data from database');
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

  private insertNewType():void {

  }

}
