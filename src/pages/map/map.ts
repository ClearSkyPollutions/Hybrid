import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { MapProvider } from '../../providers/map/map';


@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  constructor(public navCtrl: NavController,
              private mapProvider: MapProvider) {

  }

  ionViewDidLoad() {
    this.mapProvider.getUserPosition('map');
  }

}
