import { Component, ViewChild } from '@angular/core';
import { NavController, IonicPage, NavParams } from 'ionic-angular';

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
 
  location     : any;
  data         : Data;

  scale        : string;
  pollutantType: string;
  pollutantUnit:  string;

  private chartLabels: any = [];
  private chartValues: any = [];
  
  constructor(
    public navCtrl       : NavController,
    public navParams     : NavParams,
    private dataProvider : DataProvider,
    public translate     : TranslateService,
    private chartProvider: ChartProvider
  ){
    this.location      = this.navParams.get('location');
    this.scale         = 'AVG_HOUR';
    this.pollutantType = 'pm10';
    this.pollutantUnit = 'µg/m³';
      this.showLastMesure();
  }

  ionViewDidLoad() { 
     this.chartProvider.initChart(this.lineChart)
     this.drawLineChart();
  }

  private showLastMesure(){
    this.dataProvider.getLastMesure().subscribe(
      lastdata => {
        this.data = {
          pm     : lastdata.pm['AVG_HOUR'][0],
          temphum: lastdata.temphum['DHT22'][0]
        };
      }
    );        
  }


   private dateForChartLabel(dateMesure: string){
    let date = new Date(dateMesure);
    switch(this.scale) { 
      case 'AVG_HOUR': { 
        return date.getHours() + ':' + (date.getMinutes()<10 ? '0' + date.getMinutes(): date.getMinutes());
      } 
      case 'AVG_DAY': { 
        return date.getDate();
      } 
      case 'AVG_MONTH': { 
        return date.getMonth() + 1;
      } // AVG_YEAR
      default: { 
        return date.getFullYear();
      } 
    }
   }

   private createLineChart(){
    this.chartProvider.updateLineChart(
      this.chartLabels,
      this.chartValues, 
      this.pollutantUnit
    )
  }

  chooseScale(scale: string){
   this.scale= scale;
   this.drawLineChart();
  }

  shoosePollutant(pollutantType: string, pollutantUnit){
    this.pollutantType= pollutantType;
    this.pollutantUnit= pollutantUnit;
    this.drawLineChart();
  }


  private drawLineChart(){
    this.chartLabels = [];
    this.chartValues = [];

    this.dataProvider.defineDataForChart(this.scale, this.pollutantType).subscribe(res =>{
     
      // loop through res in reverse order
      for (var i=res.length-1; i>=0; i--) {  
       this.chartLabels.push(this.dateForChartLabel(res[i].date));
       this.chartValues.push(res[i][this.pollutantType]);
      }
    
     this.createLineChart();
    });
  }

}
