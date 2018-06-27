import { Component, ViewChildren, QueryList } from '@angular/core';
import { ModalController, IonicPage, NavParams, Modal, Refresher } from 'ionic-angular';

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

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private dataProvider: DataProvider,
    private translate: TranslateService,
    private chartProvider: ChartProvider,
    private aqIndexProvider: AirQualityIndexProvider,
    private sqliteProvider: SqliteProvider,
    private localNotifications: LocalNotifications
  ) {
    this.city = this.navParams.get('location');

    this.aqIndexProvider.getAQI().subscribe( (res : AQI) => {
      this.aqIndex = res;
     if (this.aqIndex.index > 5 ) {
      this.localNotifications.schedule({
        title: 'Air quality',
        text: this.aqIndex.index + '(' + this.aqIndex.level + ')'
      });
    }
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
    this.sqliteProvider.synchroniseAllDatabase().then (() => {
      this.updateAllCharts();
    });
  });
  }

doRefresh(refresher: Refresher) :void {
  console.log('Begin async operation');
  this.sqliteProvider.synchroniseAllDatabase().then(() :void => {
    console.log('Async operation has ended');
    this.updateAllCharts();
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
  this.dataProvider.getLastMesure().subscribe(
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
}