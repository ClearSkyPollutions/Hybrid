import { Component, ViewChildren, QueryList,  AfterViewInit } from '@angular/core';
import { ModalController, IonicPage, NavParams } from 'ionic-angular';

import { Data } from '../../models/data.interface';
import { DataProvider } from '../../providers/data/data.service';
import { TranslateService } from '@ngx-translate/core';
import { ChartProvider } from '../../providers/chart/chart.service';
import { ChartInfo } from '../../models/chartInfo.interface';
import { City } from '../../models/city.interface';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements AfterViewInit {

  @ViewChildren('try') chartsC: QueryList<any>;

  charts: ChartInfo[] = [];
  location: City;
  data: Data;
  showParams: boolean = false;

  constructor(
    public modalCtrl: ModalController,
    public navParams: NavParams,
    private dataProvider: DataProvider,
    public translate: TranslateService,
    private chartProvider: ChartProvider,
  ) {
    this.location = this.navParams.get('location');

    //@TODO : load data from somewhere
    this.charts.push({ type: "pm10", unit: "µg/m^3", lineColor: '#046bfe', chartView: "" })
    this.charts.push({ type: "pm25", unit: "µg/m^3", lineColor: '#02d935', chartView: "" })
    this.charts.push({ type: "temperature", unit: "°C", lineColor: '#ff2039', chartView: "" })
    this.charts.push({ type: "humidity", unit: "µg/m^3", lineColor: '#ffab00', chartView: "" })
    this.showLastMesure();

  }

  ngAfterViewInit() {
    this.chartsC.forEach((c, index) => {
      this.charts[index].chartView = c.nativeElement;
      this.drawLineChart(this.charts[index]);
    })
    this.chartsC.changes.subscribe((c) => {
      console.log("Change");
      if (this.charts[this.charts.length - 1].chartView == null) {
        this.charts[this.charts.length - 1].chartView = this.chartsC.last.nativeElement;
        console.log(this.charts);
        console.log(this.chartsC);
        this.drawLineChart(this.charts[this.charts.length - 1]);
      }
    });
  }

  private showLastMesure() {
    this.dataProvider.getLastMesure().subscribe(
      lastdata => {
        this.data = {
          pm: lastdata.pm['AVG_HOUR'][0],
          temphum: lastdata.temphum['DHT22'][0]
        };
      }
    );
  }

  private showSettings() {
    if (this.showParams)
      this.showParams = false;
    else
      this.showParams = true;
  }

  private deleteCard(oldSensor: ChartInfo) {
    console.log("Removed data " + oldSensor.type);
    this.charts = this.charts.filter(elem => {
      return (elem.type != oldSensor.type);
    });
  }

  private dateForChartLabel(dateMesure: string) {
    let date = new Date(dateMesure);
    return date.getHours() + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
  }

  private drawLineChart(chart: ChartInfo) {
    let chartLabels = [];
    let chartValues = [];

    this.dataProvider.defineDataForChart('AVG_HOUR', chart.type).subscribe(res => {

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
      )
    });
  }

  openChartModal(pollutant: string, unit: string, color: string) {
    let chartOptions = {
      pollutant: pollutant,
      unit: unit,
      color: color
    }
    this.modalCtrl.create('ChartModalPage', { chartOptions: chartOptions }, {
      cssClass: 'inset-modal',
    })
      .present();
  }

  openNewChartModal() {
    let newModal = this.modalCtrl.create('NewChartModalPage', null, {
      cssClass: 'inset-modal',
    });
    newModal.onDidDismiss(data => {
      // If cancelled :
      if (!data) {
        return;
      }
      this.charts.push({ type: data.name, unit: data.unit, lineColor: '#ffab00', chartView: null });
    });
    newModal.present();
  }
}