import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';

import { Data } from '../../models/data.interface';
import { DataProvider } from '../../providers/data/data.service';
import { TranslateService } from '@ngx-translate/core';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  data : Data;
  
  constructor(
    public navCtrl: NavController,
    private dataProvider : DataProvider,
    public translate: TranslateService
  ) {
    this.showLastMesure();
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

}
