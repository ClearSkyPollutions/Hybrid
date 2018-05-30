import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';
import { CITIES } from '../../configs/cities.data';
import { City } from '../../models/city.interface';



@IonicPage()
@Component({
  selector: 'page-list-city',
  templateUrl: 'list-city.html'
})
export class ListCityPage {

  cities= CITIES;
  
  constructor(public navCtrl: NavController) {
  }
  goToCityDetail(city: City) {
    this.navCtrl.push('HomePage',{ location: city });
  }

}
