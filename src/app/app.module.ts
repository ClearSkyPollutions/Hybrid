import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicStorageModule } from '@ionic/storage';

/* Providers */
import { PolluantProvider } from '../mocks/providers/polluant';
import { DataProvider } from '../providers/data/data.service';
import { AlertProvider } from '../providers/alert/alert.service';
import { ChartProvider } from '../providers/chart/chart.service';
import { SettingsProvider } from '../providers/settings/settings.service';
import { AirQualityIndexProvider } from '../providers/air-quality-index/air-quality-index.service';
import { SqliteProvider } from '../providers/sqlite/sqlite.service';
import { BluetoothProvider } from '../providers/bluetooth/bluetooth';

/* Native components */
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SQLite } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { MapsProvider } from '../providers/maps/maps.service';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Geolocation } from '@ionic-native/geolocation';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { BluetoothConnectionPage } from '../pages/bluetooth-connection/bluetooth-connection';
import { SigFoxDataPage } from '../pages/sigfox-data/sigfox-data'
import { ChartDataSigFoxPage } from '../pages/chart-data-sig-fox/chart-data-sig-fox';







export function createTranslateLoader(http: HttpClient) :TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    MyApp,
    SigFoxDataPage,
    ChartDataSigFoxPage
    


  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [ HttpClient ]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SigFoxDataPage,
    ChartDataSigFoxPage

    


  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    SQLitePorter,
    LocalNotifications,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DataProvider,
    PolluantProvider,
    AlertProvider,
    ChartProvider,
    AirQualityIndexProvider,
    SettingsProvider,
    SqliteProvider,
    MapsProvider,
    Geolocation,
    BluetoothSerial,
    BluetoothProvider,


  ]
})

export class AppModule {}