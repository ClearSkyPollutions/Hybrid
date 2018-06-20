import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import leaflet from 'leaflet';

@IonicPage()
@Component({
    selector: 'page-maps',
    templateUrl: 'maps.html',
})
export class MapsPage {
  map: leaflet.Map;
  center: leaflet.PointTuple;


  constructor(public navCtrl: NavController, public navParams: NavParams, public translate: TranslateService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapsPage');

    //set map center
    //this.center = [48.137154, 11.576124]; //Munich
    //this.center = [48.775556, 9.182778]; //Stuttgart
    this.center = [45.1326, 5.7266]; //Grenoble
    
    //setup leaflet map
    this.initMap();
  }

  initMap() {
    
    this.map = leaflet.map('map', {
        center: this.center,
        zoom: 6,
        maxZoom: 12
    });

    //Add OSM Layer
    leaflet.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    
    var gpsSensor = [];
    gpsSensor[0] = [45.22538, 5.801706999999965];
    gpsSensor[1] = [45.188529, 5.724523999999974];
    gpsSensor[2] = [45.764043, 4.835658999999964];
    gpsSensor[3] = [48.85661400000001, 2.3522219000000177];
    gpsSensor[4] = [48.57340529999999, 7.752111300000024];

    for (var i=0; i < gpsSensor.length ; i++){
        var circle = leaflet.circleMarker(gpsSensor[i], {
            color: 'blue',
            fillColor: '#0033FF',
            fillOpacity: 0.5,
            radius: 30
        }).addTo(this.map);
    }

}

}
