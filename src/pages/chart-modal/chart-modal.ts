import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core'
import { DataProvider } from '../../providers/data/data.service';
import { ChartProvider } from '../../providers/chart/chart.service';



@IonicPage()
@Component({
  selector: 'page-chart-modal',
  templateUrl: 'chart-modal.html',
})
export class ChartModalPage {

  @ViewChild('lineChart') lineChart;
  chartOptions: any;
  scale       : string;
  chartLabels = [];
  chartValues = [];

  constructor(public translate    : TranslateService,
     public navCtrl       : NavController,
     public navParams     : NavParams,
     private dataProvider : DataProvider,
     private chartProvider: ChartProvider) {
    this.chartOptions = this.navParams.get('chartOptions');
    this.scale        = 'AVG_HOUR';
  }

  ionViewDidLoad() {
    this.chartProvider.initChart(this.lineChart);
    this.drawLineChart();
  }

  private drawLineChart(){
    this.chartLabels = [];
    this.chartValues = [];

    this.dataProvider.defineDataForChart(this.scale, this.chartOptions.pollutant).subscribe(res =>{
     
      // loop through res in reverse order
      for (var i=res.length-1; i>=0; i--) {  
       this.chartLabels.push(this.dateForChartLabel(res[i].date));
       this.chartValues.push(res[i][this.chartOptions.pollutant]);
      }

      this.chartProvider.updateLineChart(
        this.lineChart,
        this.chartLabels,
        this.chartValues, 
        this.chartOptions.color
      )
    });
  }

  private dateForChartLabel(dateMesure: string){
    let date = new Date(dateMesure);
    switch(this.scale) { 
      case 'AVG_HOUR': { 
        return date.getHours() + 'h:' + (date.getMinutes()<10 ? '0' + date.getMinutes(): date.getMinutes());
      } 
      case 'AVG_DAY': { 
        return date.getDate()  + 'j';
      } 
      case 'AVG_MONTH': { 
        return date.getMonth() + 1  + 'm'; ;
      } // AVG_YEAR
      default: { 
        return date.getFullYear();
      } 
    }
   }

   chooseScale(scale: string){
    this.scale= scale;
    this.drawLineChart();
   }

   closeModal(){
    this.navCtrl.pop();
   }


}
