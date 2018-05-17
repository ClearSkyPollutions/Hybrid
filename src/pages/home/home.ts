import { Component, ViewChild } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';

import { Mesure } from '../../models/mesure';
import { MesureProvider } from '../../providers/mesure/mesure';
import { ChartProvider } from '../../providers/chart/chart.service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('lineChart') lineChart;
  @ViewChild('barChart') barChart;

  mesures: Mesure[];

  private dataForTest = [{"id":1,"date":"2018-04-20 14:50:00","pm2_5":"12.00","pm10":"24.00"}, {"id":1,"date":"2018-04-21 15:50:00","pm2_5":"125.00","pm10":"25.00"}, {"id":1,"date":"2018-04-22 14:50:00","pm2_5":"130.00","pm10":"22.00"}, {"id":1,"date":"2018-04-23 14:50:00","pm2_5":"140.00","pm10":"20.00"}, {"id":1,"date":"2018-04-20 14:50:00","pm2_5":"12.00","pm10":"18.00"}]
  private chartLabels  : any  = [];
  private chartValues  : any  = [];
  
  constructor(
    public navCtrl: NavController,
    private mesureProvider : MesureProvider,
    private chartProvider: ChartProvider) {
      this.showLastMesure();

  }

  ionViewDidLoad() { 
     this.defineChartData();
     this.createLineChart(); //
    // this.createBarChart(); //
  }

  showLastMesure(){
    this.mesureProvider.getLastMesure().subscribe(
      data => {
        this.mesures = data['Concentration_pm'];
      }
    );        
  }

  defineChartData()
   {
    //  this.mesureProvider.getAllMesure().subscribe(
    //    res => {
    //      console.log(res['Concentration_pm']);
    //     let k: any;
    //     for(k in res['Concentration_pm']){
    //        var data = res['Concentration_pm'][k];
    //        this.chartLabels.push(data.date);
    //        this.chartValues.push(data.pm10);
    //     }
    //     this.createLineChart();
    //     this.createBarChart();
    //    }
    //  )

   for (let data of this.dataForTest) {
    let date = new Date(data.date);
    let time = date.getHours() + ':' + date.getMinutes();

    this.chartLabels.push(time);
    this.chartValues.push(data.pm10);
   }
    
   }
  
  createLineChart(){
    this.chartProvider.createLineChart(this.lineChart, this.chartLabels, this.chartValues)
  }

  createBarChart(){
    this.chartProvider.createBarChart(this.barChart, this.chartLabels, this.chartValues)
  }


}
