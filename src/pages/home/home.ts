import { Component, ViewChild } from '@angular/core';
import { ModalController, IonicPage, NavParams } from 'ionic-angular';

import { Data } from '../../models/data.interface';
import { DataProvider } from '../../providers/data/data.service';
import { TranslateService } from '@ngx-translate/core';
import { ChartProvider } from '../../providers/chart/chart.service';
import { AirQualityIndexProvider } from '../../providers/air-quality-index/air-quality-index.service';
import { AQI } from '../../models/aqi';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  @ViewChild('lineChartPm10') lineChartPm10;
  @ViewChild('lineChartPm25') lineChartPm25;
  @ViewChild('lineChartHum') lineChartHum;
  @ViewChild('lineChartTemp') lineChartTemp;
  
  
  city   : any;
  data   : Data;
  aqIndex: AQI;

  constructor(
    public modalCtrl       : ModalController,
    public navParams       : NavParams,
    private dataProvider   : DataProvider,
    public translate       : TranslateService,
    private chartProvider  : ChartProvider,
    private aqIndexProvider: AirQualityIndexProvider
  ){
      this.city      = this.navParams.get('location');
      this.aqIndexProvider.getAQI().subscribe( res => this.aqIndex = res );
      this.showLastMesure();
  }

  ionViewDidLoad() { 
     this.drawLineChart(this.lineChartPm10, 'pm10','µg/m³', '#046bfe');
     this.drawLineChart(this.lineChartPm25, 'pm25','µg/m³', '#02d935');
     this.drawLineChart(this.lineChartHum, 'humidity','%', '#ff2039');
     this.drawLineChart(this.lineChartTemp, 'temperature','C°', '#ffab00');
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
      return date.getHours() + ':' + (date.getMinutes()<10 ? '0' + date.getMinutes(): date.getMinutes());
   }



  private drawLineChart(htmlElement: any, pollutantType: string, yAxesUnit: string, color: string){
    let chartLabels = [];
    let chartValues = [];

    this.dataProvider.defineDataForChart('AVG_HOUR', pollutantType).subscribe(res =>{
     
      // loop through res in reverse order
      for (var i=res.length-1; i>=0; i--) {  
       chartLabels.push(this.dateForChartLabel(res[i].date));
       chartValues.push(res[i][pollutantType]);
      }

      this.chartProvider.createLineChart(
        htmlElement,
        chartLabels,
        chartValues, 
        pollutantType + ' (' +yAxesUnit+')',
        color
      )
    });
  }


  openChartModal(pollutant: string, unit: string, color: string) {
    let chartOptions= {
      pollutant: pollutant,
      unit: unit,
      color: color
    }
    this.modalCtrl.create('ChartModalPage', { chartOptions: chartOptions}, { cssClass: 'inset-modal'} )
                  .present();
  }

}
