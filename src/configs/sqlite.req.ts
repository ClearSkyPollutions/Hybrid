export const SQLITE_REQ = {
  sql : 'CREATE TABLE POLLUTANT (id integer PRIMARY KEY AUTOINCREMENT, name string, unit string, sensor string);' +
        'INSERT INTO POLLUTANT(name, unit, sensor) VALUES("pm10", "µg/m^3", "SDS011"),("pm25", "µg/m^3", "SDS011"),("temperature", "°C", "DHT22"),("humidity", "%", "DHT22");' +
        'CREATE TABLE IF NOT EXISTS AVG_HOUR (date datetime, value float, typeId integer, FOREIGN KEY(typeId) REFERENCES Type(id), PRIMARY KEY (date, typeId));' +
        'CREATE TABLE IF NOT EXISTS AVG_DAY (date datetime, value float, typeId integer, FOREIGN KEY(typeId) REFERENCES Type(id), PRIMARY KEY (date, typeId));' +
        'CREATE TABLE IF NOT EXISTS AVG_MONTH (date datetime, value float, typeId integer, FOREIGN KEY(typeId) REFERENCES Type(id), PRIMARY KEY (date, typeId));' +
        'CREATE TABLE IF NOT EXISTS AVG_YEAR (date datetime, value float, typeId integer, FOREIGN KEY(typeId) REFERENCES Type(id), PRIMARY KEY (date, typeId));'

};
