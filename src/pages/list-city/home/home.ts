import { Component, ViewChildren, QueryList } from '@angular/core';
import { ModalController, IonicPage, NavParams, Modal, Refresher, ToastController, Events } from 'ionic-angular';

// providers
import { DataProvider } from '../../../providers/data/data.service';
import { TranslateService } from '@ngx-translate/core';
import { ChartProvider } from '../../../providers/chart/chart.service';
import { AirQualityIndexProvider } from '../../../providers/air-quality-index/air-quality-index.service';

// intefaces
import { ChartInfo, ChartOptions } from '../../../models/chartInfo.interface';
import { City } from '../../../models/city.interface';
import { AQI } from '../../../models/aqi';
// Natives
import { SqliteProvider } from '../../../providers/sqlite/sqlite.service';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { ErrorDetails } from '../../../models/shared/error-banner.interface';
import { Storage } from '@ionic/storage';
import { AddressServer } from '../../../models/addressServer.interface';
import { InitConfig } from '../../../models/init-config.interface';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage  {

  @ViewChildren('ch') chartsC: QueryList<any>;

  charts      : ChartInfo[] = [];
  city        : City;
  data        : any;
  aqIndex     : AQI;
  showParams  : boolean = false;
  color       : string;
  raspi       : AddressServer;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private dataProvider: DataProvider,
    private translate: TranslateService,
    private chartProvider: ChartProvider,
    private aqIndexProvider: AirQualityIndexProvider,
    private sqliteProvider: SqliteProvider,
    private localNotifications: LocalNotifications,
    private toastCtrl   : ToastController,
    public events       : Events,
    private storage: Storage
  ) {
    this.city = this.navParams.get('location');
    this.storage.get('initConfig').then( (val: InitConfig) => {
      this.raspi = val.rasp_ip;
      this.aqIndexProvider.getAQI(val.rasp_ip).subscribe( (res : AQI) => {
        this.aqIndex = res;
        this.color = this.aqIndex.color;
       if (this.aqIndex.index > 5 ) {
        this.localNotifications.schedule({
          title: this.translate.instant('airquality'),
          text: this.aqIndex.index + '(' + this.aqIndex.level + ')'
        });
      }
      });
    });

    //@TODO: load data from somewhere
    this.charts.push({ type: 'pm10', unit: 'µg/m^3', lineColor: '#046bfe', chartView: '' });
    this.charts.push({ type: 'pm25', unit: 'µg/m^3', lineColor: '#02d935', chartView: '' });
    this.charts.push({ type: 'temperature', unit: '°C', lineColor: '#ff2039', chartView: '' });
    this.charts.push({ type: 'humidity', unit: '%', lineColor: '#ffab00', chartView: '' });
    //this.showLastMesure();
  }

  ngAfterViewInit() :void {
  this.sqliteProvider.createSQLiteDatabase().then((res:void) => {
    this.sqliteProvider.synchroniseAllDatabase(this.raspi)
    .then(() => {
      this.updateAllCharts();
    });
  });
  }

doRefresh(refresher: Refresher) :void {
  console.log('Begin async operation');
  this.sqliteProvider.synchroniseAllDatabase(this.raspi).then(() :void => {
    this.updateAllCharts();
    this.events.subscribe('CLEAR_SKY:Error', (error: ErrorDetails) => {
      console.log('Welcome', error);
       this.toastCtrl.create({
        message: error.event,
        duration: 3000,
        position: 'bottom'
      }).present();
    });
    refresher.complete();
  });
}

updateAllCharts() :void {
  console.log('in updateAllCharts function');
  this.chartsC.forEach((c:any, index :number) => {
    this.charts[index].chartView = c.nativeElement;
    this.drawLineChart(this.charts[index]);
  });
  this.chartsC.changes.subscribe(() => {
    const last = this.charts.length - 1;
    if (last >= 0 && !this.charts[last].chartView) {
      this.charts[last].chartView = this.chartsC.last.nativeElement;
      this.drawLineChart(this.charts[last]);
    }
  });
}

private showSettings() :void {
    this.showParams = !this.showParams;
}

private getRandomColor() : string {
  const lineColors = ['#046bfe', '#02d935', '#ff2039', '#ffab00'];
  return lineColors[Math.floor(Math.random() * lineColors.length)];
}

private showLastMesure() :void {
  this.dataProvider.getLastMesure(this.raspi).subscribe(
    (lastdata : any) => {
      this.data = {
        pm: lastdata.pm['AVG_HOUR'][0],
        temphum: lastdata.temphum['DHT22'][0]
      };
    }
  );
}

private deleteCard(oldSensor: ChartInfo) :void {
  console.log('Removed data ' + oldSensor.type);
  this.charts = this.charts.filter((elem : ChartInfo) => (elem.type != oldSensor.type));
}



private dateForChartLabel(dateMesure: string) :string {
  const date = new Date(dateMesure);
  return date.getHours() + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
}

private drawLineChart(chart: ChartInfo) :Promise<void> {
  const chartLabels :string[] = [];
  const chartValues :string[] = [];
  //TODO: handle first connexion (when tables are not created yet)
  return this.sqliteProvider.requestDataForChart('AVG_HOUR', chart.type).then((res :any) => {
    if (res.length > 0) {
      console.log('trying to draw chart ..', res);
      // loop through res in reverse order
      for (var i = res.length - 1; i >= 0; i--) {
        chartLabels.push(this.dateForChartLabel(res[i].date));
        chartValues.push(res[i].value);
      }
      return this.chartProvider.createLineChart(
        chart.chartView,
        chartLabels,
        chartValues,
        chart.type + ' (' + chart.unit + ')',
        chart.lineColor
      );
    }
  });
}

openChartModal(pollutant: string, unit: string, color: string) :void {
  const chartOptions : ChartOptions = {
    pollutant: pollutant,
    unit: unit,
    color: color
  };
  this.modalCtrl.create('ChartModalPage', { chartOptions: chartOptions }, {
    cssClass: 'inset-modal',
  })
    .present();
}

openAddChart() :void {
  const newModal : Modal = this.modalCtrl.create('AddChartPage', null, {
    cssClass: 'inset-modal',
  });
  newModal.onDidDismiss((data :any) => {
    // If cancelled :
    if (!data) {
      return;
    }
    this.charts.push({type: data.name, unit: data.unit, lineColor: this.getRandomColor(), chartView: null });
  });
  newModal.present();
}

getColorOfAqi(index: number) :string {
  let color : string;
  if (index <= 10 && index > 7 ) {
    return color = '#fa5858';
  } else if (index <= 7 && index > 4 ) {
    return color = '#ffbf00';
  } else {
    return color = '#80ff00';
  }
}
}