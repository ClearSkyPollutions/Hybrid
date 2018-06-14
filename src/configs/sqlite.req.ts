export const SQLITE_REQ = {
  sql : 'CREATE TABLE TYPE (id integer PRIMARY KEY AUTOINCREMENT, name string, sensor string);' +
        'INSERT INTO TYPE (name,sensor) VALUES("pm25", "SDS011"),("pm10", "SDS011"),("temperature", "DHT22"),("humidity", "DHT22");' +
        'CREATE TABLE IF NOT EXISTS AVG_HOUR (date datetime, value float, type integer, FOREIGN KEY(type) REFERENCES Type(id), PRIMARY KEY (date, type));' +
        'CREATE TABLE IF NOT EXISTS AVG_DAY (date datetime, value float, type integer, FOREIGN KEY(type) REFERENCES Type(id), PRIMARY KEY (date, type));' +
        'CREATE TABLE IF NOT EXISTS AVG_MONTH (date datetime, value float, type integer, FOREIGN KEY(type) REFERENCES Type(id), PRIMARY KEY (date, type));' +
        'CREATE TABLE IF NOT EXISTS AVG_YEAR (date datetime, value float, type integer, FOREIGN KEY(type) REFERENCES Type(id), PRIMARY KEY (date, type));'

};

/*
SELECT t1.date, t1.value from AVG_HOUR t1 inner join TYPE t2 ON t1.type=t2.id
WHERE t2.name = "pm10" ORDER BY t1.date DESC LIMIT 24;*/
