import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { SqliteProvider } from '../../providers/sqlite/sqlite.service';
import { ChartProvider } from '../../providers/chart/chart.service';

/**
 * Generated class for the ChartDataSigFoxPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-chart-data-sig-fox',
  templateUrl: 'chart-data-sig-fox.html',
})
export class ChartDataSigFoxPage {

  @ViewChild('lineChart') lineChart: any;
  chartOptions: any;
  scale: string;
  chartLabels: any[] = [];
  chartValues: any[] = [];

  constructor(public translate    : TranslateService,
     public navCtrl       : NavController,
     public navParams     : NavParams,
     private sqliteProvider : SqliteProvider,
     private chartProvider: ChartProvider) {
    this.chartOptions = this.navParams.get('chartOptions');
    this.scale = 'AVG_HOUR';
  }

  ionViewDidLoad(): void {
    console.log("poulet braisé2");
    this.chartProvider.initChart(this.lineChart);
    console.log("poulet braisé3");
    this.drawLineChart();
  }

  private drawLineChart(): void {
    this.chartLabels = [];
    

    /*this.sqliteProvider.requestDataForChart(this.scale, this.chartOptions.pollutant).then((res :any) => {
      // loop through res in reverse order
      for (var i: number = res.length - 1; i >= 0; i--) {
       this.chartLabels.push(this.dateForChartLabel(res[i].date));
       this.chartValues.push(res[i].value);
      }
      this.chartProvider.updateLineChart(
        this.lineChart,
        this.chartLabels,
        this.chartValues,
        this.chartOptions.color
      );
    });*/
  }

  /*private dateForChartLabel(dateMesure: string): string {
    const date = new Date(dateMesure);
    switch (this.scale) {
      case 'AVG_HOUR': {
        return date.getHours() + 'h:' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
      }
      case 'AVG_DAY': {
        return date.getDate() + 'j';
      }
      case 'AVG_MONTH': {
        return date.getMonth() + 1 + 'm';
      } // AVG_YEAR
      default: {
        return date.getFullYear() + 'y';
      }
    }
  }*/

  chooseScale(scale: string): void {
    this.scale = scale;
    //this.drawLineChart();
  }

  closeModal(): void {
    this.navCtrl.pop();
  }

}
