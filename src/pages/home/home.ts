import { Component, ViewChild } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';

import { Data } from '../../models/data.interface';
import { DataProvider } from '../../providers/data/data.service';
import { TranslateService } from '@ngx-translate/core';
import { ChartProvider } from '../../providers/chart/chart.service';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  @ViewChild('lineChart') lineChart;
  @ViewChild('barChart') barChart;

  data : Data;
  selectedTab : string = 'Segment1';

  private dataForTest = [{"id":1,"date":"2018-04-20 14:50:00","pm2_5":"12.00","pm10":"24.00"}, {"id":1,"date":"2018-04-21 15:50:00","pm2_5":"125.00","pm10":"25.00"}, {"id":1,"date":"2018-04-22 14:50:00","pm2_5":"130.00","pm10":"22.00"}, {"id":1,"date":"2018-04-23 14:50:00","pm2_5":"140.00","pm10":"20.00"}, {"id":1,"date":"2018-04-20 14:50:00","pm2_5":"12.00","pm10":"18.00"}]
  private chartLabels  : any  = [];
  private chartValues  : any  = [];
  
  constructor(
    public navCtrl: NavController,
    private dataProvider : DataProvider,
    public translate: TranslateService,
    private chartProvider: ChartProvider) {
      this.showLastMesure();

  }

  ionViewDidLoad() { 
     this.defineChartData('PM10');
     //this.createLineChart(); //
    // this.createBarChart(); //

  }

  showLastMesure(){
    this.dataProvider.getLastMesure().subscribe(
      lastdata => {
        this.data = {
          pm : lastdata.pm['Concentration_pm'][0],
          temphum : lastdata.temphum['DHT22'][0]
        };
      }
    );        
  }

  defineChartData(pollutant : string)
   {
     this.dataProvider.getAllMesure().subscribe(
       res => {
        let allData = res['Concentration_pm'];
        for (let data of allData) {
          let date = new Date(data.date);
          let time = date.getHours() + ':' + date.getMinutes();
      
          this.chartLabels.push(time);
          this.chartValues.push(data.pm10);
         }     
        this.createLineChart();
        //this.createBarChart();
       }
     )   
   }
  
  createLineChart(){
    this.chartProvider.createLineChart(this.lineChart, this.chartLabels, this.chartValues)
  }

  createBarChart(){
    this.chartProvider.createBarChart(this.barChart, this.chartLabels, this.chartValues)
  }


}
