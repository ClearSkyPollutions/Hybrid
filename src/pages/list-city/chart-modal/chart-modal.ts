import { Component, ViewChild, ModuleWithComponentFactories } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { ChartProvider } from '../../../providers/chart/chart.service';
import { SqliteProvider } from '../../../providers/sqlite/sqlite.service';
import { round } from 'lodash';
import { Chart } from 'chart.js';
import * as moment from 'moment';



@IonicPage()
@Component({
  selector: 'page-chart-modal',
  templateUrl: 'chart-modal.html',
})
export class ChartModalPage {

  @ViewChild('lineChart') lineChart: any;
  //@ViewChild('lineCanvas') lineCanvas
  chartOptions: any;
  scale: string;
  chartLabels: any[] = [];
  chartValues: any[] = [];
  chartValues2: any[] = [];
  chartValuesGaz: any[] = [];
  chartValuesTemp: any[] = [];
 
  options: any;
  postbis: any;



  constructor(public translate    : TranslateService,
     public navCtrl       : NavController,
     public navParams     : NavParams,
     private sqliteProvider : SqliteProvider,
     private chartProvider: ChartProvider) {
    this.chartOptions = this.navParams.get('chartOptions');
    this.scale = 'AVG_HOUR';
    
            }      
  




  ionViewDidLoad(): void {
    this.postbis = this.navParams.get('Post');
    //console.log(this.postbis);
    /*this.postbis.forEach(element => {
      this.chartLabels.push(element.date);

       

        
    });*/
    //this.grap2();
    this.chartProvider.initChart(this.lineChart);
    //let date = this.dateForChartLabel("1559145997");
    //console.log('date: ', date);
    this.drawLineChart();
    //this.chartProvider.createLineChart(this.lineChart,["poule","nouille"],this.chartValues,[1,2,3,4,],this.chartOptions.color);
  }


  private drawLineChart(): void {
    this.chartLabels =[];
    this.chartValues = this.navParams.get('PMS1_0');
    
    
    let charValBis = [];
    this.chartValues.map(elem => {
      //console.log('round(elem) ', round(elem));
      //console.log('Math.round(elem) ', Math.round(elem));
      charValBis.push(round(elem));
    })
    this.chartValues = charValBis;
   // console.log('this.chartValues: ', this.chartValues);

    /*this.sqliteProvider.requestDataForChart(this.scale, this.chartOptions.pollutant).then((res :any) => {
      // loop through res in reverse order
      for (var i: number = res.length - 1; i >= 0; i--) {
       this.chartLabels.push(this.dateForChartLabel(res[i].date));
       this.chartValues.push(res[i].value);
      }
      */
    this.postbis.forEach(element => {
      this.chartLabels.push(this.dateForChartLabel(element.date));
    });
    // console.log('this.chartLabels: ', this.chartLabels);

     this.chartProvider.updateLineChart(
        this.lineChart,
        this.chartLabels,
        this.chartValues,
        this.chartOptions.color
      );
    //});
  }

  private dateForChartLabel(dateMesure: any): string {
    const date = new Date(dateMesure);
    switch (this.scale) {
      case 'AVG_HOUR': {
        return moment.unix(dateMesure).format('LT');
      }
      case 'AVG_DAY': {
        return moment.unix(dateMesure).format(' Do h::mm');
      }
      case 'AVG_MONTH': {
        return moment.unix(dateMesure).format('MMM Do');
      } // AVG_YEAR
      default: {
        return date.getFullYear() + 'y';
      }
    }
  }

  chooseScale(scale: string): void {
    this.scale = scale;
    this.drawLineChart();
  }

  
  
  closeModal(): void {
    this.navCtrl.pop();
  }


}
