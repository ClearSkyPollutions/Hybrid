import { Component, ViewChildren, QueryList } from '@angular/core';
import { ModalController, IonicPage, NavParams, Modal, Refresher, ToastController, Events, LoadingController } from 'ionic-angular';

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
import { Storage } from '@ionic/storage';
import { AddressServer } from '../../../models/addressServer.interface';
import { InitConfig } from '../../../models/init-config.interface';
import { Observable } from 'rxjs/Observable';



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
  server      : AddressServer;
  addr        : AddressServer;

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
    //@TODO: load data from somewhere
    this.charts.push({ type: 'pm10', unit: 'µg/m^3', lineColor: '#046bfe', chartView: '' });
    this.charts.push({ type: 'pm25', unit: 'µg/m^3', lineColor: '#02d935', chartView: '' });
    this.charts.push({ type: 'temperature', unit: '°C', lineColor: '#ff2039', chartView: '' });
    this.charts.push({ type: 'humidity', unit: '%', lineColor: '#ffab00', chartView: '' });
    //this.showLastMesure();
  }

  ngAfterViewInit() :void {
    this.storage.get('initConfig').then( (val: InitConfig) => {
      this.raspi = val.rasp_ip;
      this.server = val.server_ip;
      this.checkAndSynchronize();
      this.syncAQI();
    });
  }

  doRefresh(refresher: Refresher) :void {
    console.log('Begin async operation');
    this.syncAQI();
    this.dataProvider.checkConnection(this.raspi)
    .timeoutWith(5000, Observable.throw(
      () => {this.showChartData(this.server, refresher); }))
    .subscribe(
      () => { this.showChartData(this.raspi, refresher); },
      () => {this.dataProvider.checkConnection(this.server)
        .timeoutWith(5000, Observable.throw(
          () => {
            this.showToast(this.translate.instant('home_toast_no_connection'));
            refresher.complete();
          }))
        .subscribe(
          () => { this.showChartData(this.server, refresher); },
          () => {
            this.showToast(this.translate.instant('home_toast_no_connection'));
            refresher.complete();
          });
      });
  }

  private updateAllCharts() :void {
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
      if (res != null) {
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
        } else {
          this.drawLineChart(chart);
        }
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

  private showToast(msg: string) :void {
    const toast = this.toastCtrl.create({
      position: 'bottom',
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  private checkAndSynchronize() : void {
    this.dataProvider.checkConnection(this.raspi)
    .timeoutWith(2000, Observable.throw(
      () => {this.showChartData(this.server, null); }))
    .subscribe(
      () => { this.showChartData(this.raspi, null); },
      () => {this.dataProvider.checkConnection(this.server)
        .timeoutWith(2000, Observable.throw(
          () => {this.showToast(this.translate.instant('home_toast_no_connection')); }))
        .subscribe(
          () => { this.showChartData(this.server, null); },
          () => { this.showToast(this.translate.instant('home_toast_no_connection')); }
      );
      }
    );
  }

  syncAQI() : void {
    this.storage.get('system').then((sys : any) => {
        this.aqIndexProvider.getAQI(this.raspi, sys['id'])
        .timeoutWith(5000, Observable.throw(() => {
          this.aqIndexProvider.getAQI(this.server, sys['id']).subscribe( (res : AQI) => {
            this.showAQI(res);
          });
        }))
        .subscribe( (res : AQI) => {
          this.showAQI(res);
        }, () => {
          this.aqIndexProvider.getAQI(this.server, sys['id'])
          .timeoutWith(5000, Observable.throw(() => {console.log('getAQI timeout'); }))
          .subscribe( (res : AQI) => {
            this.showAQI(res);
          });
        });
      });
  }

  private showAQI(res : AQI) : void {
    this.aqIndex = res;
      this.color = this.aqIndex.color;
      if (this.aqIndex.index > 5 ) {
        this.localNotifications.schedule({
          title: 'Air quality',
          text: this.aqIndex.index + '(' + this.aqIndex.level + ')'
        });
      }
  }

  private showChartData(addr : AddressServer, refresher : Refresher) : void {
    this.sqliteProvider.createSQLiteDatabase().then( () => {
      this.sqliteProvider.synchroniseAllDatabase(addr).then(() => {
        this.updateAllCharts();
        if (refresher != null) {
          refresher.complete();
        }
      });
    });
  }

}