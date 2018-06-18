import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { CITIES } from '../../configs/cities.data';
import { City } from '../../models/city.interface';



@IonicPage()
@Component({
  selector: 'page-list-city',
  templateUrl: 'list-city.html'
})
export class ListCityPage {

  cities : City[] = CITIES;
  constructor(public navCtrl: NavController) {
  }
  goToCityDetail(city: City) :void {
    this.navCtrl.push('HomePage', { location: city });
  }

}
