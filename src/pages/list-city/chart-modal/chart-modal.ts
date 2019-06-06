import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { ChartProvider } from '../../../providers/chart/chart.service';
import { SqliteProvider } from '../../../providers/sqlite/sqlite.service';
import { round } from 'lodash';
import { Chart } from 'chart.js';



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



  constructor(public translate    : TranslateService,
     public navCtrl       : NavController,
     public navParams     : NavParams,
     private sqliteProvider : SqliteProvider,
     private chartProvider: ChartProvider) {
    this.chartOptions = this.navParams.get('chartOptions');
    this.scale = 'AVG_HOUR';
    
            }      


  ionViewDidLoad(): void {
    
    //this.grap2();
    this.chartProvider.initChart(this.lineChart);
    //let date = this.dateForChartLabel("1559145997");
    //console.log('date: ', date);
    this.drawLineChart();
    //this.chartProvider.createLineChart(this.lineChart,["poule","nouille"],this.chartValues,[1,2,3,4,],this.chartOptions.color);
  }


  private drawLineChart(): void {
    
    this.chartValues = this.navParams.get('PMS1_0');
    
    this.chartLabels =  ["Janvier", "Fevrier", "Mars", "Mai", "Juin", "Juillet","Aout", "Septembre", "Octobre", "Novembre", "Décembre"];
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
      */this.chartProvider.updateLineChart(
        this.lineChart,
        this.chartLabels,
        this.chartValues,
        this.chartOptions.color
      );
    //});
  }

  private dateForChartLabel(dateMesure: string): string {
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
  }

  chooseScale(scale: string): void {
    this.scale = scale;
    this.drawLineChart();
  }

  /*grap2(){
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {

      type: 'line',
      data: {
          labels: ["January", "February", "March", "April", "May", "June", "July"],
          datasets: [
              {
                  label: "PMS1_0 ug/m3",
                  fill: false,
                  lineTension: 1,
                  backgroundColor: "rgba(75,192,192,0.4)",
                  borderColor: "rgba(75,192,192,1)",
                  borderCapStyle: 'butt',
                  borderDash: [],
                  borderDashOffset: 0.0,
                  borderJoinStyle: 'miter',
                  pointBorderColor: "rgba(75,192,192,1)",
                  pointBackgroundColor: "#fff",
                  pointBorderWidth: 5,
                  pointHoverRadius: 10,
                  pointHoverBackgroundColor: "rgba(75,192,192,1)",
                  pointHoverBorderColor: "rgba(220,220,220,1)",
                  pointHoverBorderWidth: 5,
                  pointRadius: 3,
                  pointHitRadius: 15,
                  data: this.chartValues,
                  spanGaps: false,
              },

              
              {
                label: "PMS1_0 ug/m3",
                fill: false,
                lineTension: 1,
                backgroundColor: "rgba(75,80,192,0.4)",
                borderColor: "rgba(75,192,12,1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,100)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 5,
                pointHoverRadius: 10,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: this.chartValues2,
                spanGaps: false,
            },
             
          ]
      },
      option:this.options
      
      

  });

}*/
  
  closeModal(): void {
    this.navCtrl.pop();
  }


}
