import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { StoredConf } from '../../models/init-config.interface';
import { DataMapFactorized } from '../../models/dataMaps.interface';
import { MapsProvider } from '../../providers/maps/maps.service';
import { Storage } from '@ionic/storage';
import { ChartProvider } from '../../providers/chart/chart.service';
import { ChartInfo, ChartOptions } from '../../models/chartInfo.interface';



@IonicPage()
@Component({
  selector: 'page-comparative-chart',
  templateUrl: 'comparative-chart.html',
})
export class ComparativeChartPage {
   dataMapFactorized: DataMapFactorized[]; 
   charts      : ChartInfo[] = []; 

  constructor(private mapsProvider: MapsProvider,private storage: Storage, private chartProvider: ChartProvider,
   ) {
    this.storage.get('initConfig').then((val: StoredConf) => {
      this.mapsProvider.getDataSensorLocation(val.server_ip).subscribe((res: DataMapFactorized[]) => {
        this.dataMapFactorized = res;
        console.log(this.dataMapFactorized);
            });
    });
    this.charts.push({ type: 'pm10', unit: 'µg/m^3', lineColor: '#046bfe', chartView: '' });
    this.charts.push({ type: 'pm25', unit: 'µg/m^3', lineColor: '#02d935', chartView: '' });
    this.charts.push({ type: 'temperature', unit: '°C', lineColor: '#ff2039', chartView: '' });
    this.charts.push({ type: 'humidity', unit: '%', lineColor: '#ffab00', chartView: '' });
  }

}
