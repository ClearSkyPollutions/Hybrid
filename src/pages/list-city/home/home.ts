import { Component, ViewChildren, QueryList } from '@angular/core';
import { ModalController, IonicPage, NavParams, Modal, Refresher } from 'ionic-angular';
import { DataProvider } from '../../../providers/data/data.service';
import { TranslateService } from '@ngx-translate/core';
import { ChartProvider } from '../../../providers/chart/chart.service';
import { AirQualityIndexProvider } from '../../../providers/air-quality-index/air-quality-index.service';
import { AQI } from '../../../models/aqi';

import { ChartInfo, ChartOptions } from '../../../models/chartInfo.interface';
import { City } from '../../../models/city.interface';
import { SqliteProvider } from '../../../providers/sqlite/sqlite.service';

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
    public modalCtrl: ModalController,
    public navParams: NavParams,
    private dataProvider: DataProvider,
    public translate: TranslateService,
    private chartProvider: ChartProvider,
    private aqIndexProvider: AirQualityIndexProvider,
    private sqliteProvider: SqliteProvider
  ) {
    this.city = this.navParams.get('location');

    this.aqIndexProvider.getAQI().subscribe( (res : AQI) => this.aqIndex = res );

    //@TODO: load data from somewhere
    this.charts.push({ type: 'pm10', unit: 'µg/m^3', lineColor: '#046bfe', chartView: '' });
    this.charts.push({ type: 'pm25', unit: 'µg/m^3', lineColor: '#02d935', chartView: '' });
    this.charts.push({ type: 'temperature', unit: '°C', lineColor: '#ff2039', chartView: '' });
    this.charts.push({ type: 'humidity', unit: 'µg/m^3', lineColor: '#ffab00', chartView: '' });
    this.showLastMesure();

  }

  ionViewDidLoad() :void {
    this.chartsC.forEach((c:any, index :number) => {
      this.charts[index].chartView = c.nativeElement;
      this.drawLineChart(this.charts[index]);
    });
    this.chartsC.changes.subscribe(() => {
      const last = this.charts.length - 1;
      if (last >= 0 && this.charts[last].chartView == null) {
        this.charts[last].chartView = this.chartsC.last.nativeElement;
        this.drawLineChart(this.charts[last]);
      }
    });
  }

  doRefresh(refresher: Refresher) :void {
    console.log('Begin async operation', refresher);
    this.sqliteProvider.synchroniseAllDatabase();
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
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

private drawLineChart(chart: ChartInfo) :void {
  const chartLabels :string[] = [];
  const chartValues :string[] = [];

  this.dataProvider.defineDataForChart('AVG_HOUR', chart.type).subscribe((res :any) => {

    // loop through res in reverse order
    for (var i = res.length - 1; i >= 0; i--) {
      chartLabels.push(this.dateForChartLabel(res[i].date));
      chartValues.push(res[i][chart.type]);
    }

    this.chartProvider.createLineChart(
      chart.chartView,
      chartLabels,
      chartValues,
      chart.type + ' (' + chart.unit + ')',
      chart.lineColor
    );
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
    this.charts.push({ type: data.name, unit: data.unit, lineColor: this.getRandomColor(), chartView: null });
  });
  newModal.present();
}
}