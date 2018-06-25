import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { MapsProvider } from '../../providers/maps/maps.service';
import leaflet from 'leaflet';
import { DataMapFactorized, DataMapValues } from '../../models/dataMaps.interface';


@IonicPage()
@Component({
  selector: 'page-maps',
  templateUrl: 'maps.html',
})
export class MapsPage {
  map: leaflet.Map;
  center: leaflet.PointTuple;
  dataMapFactorized: DataMapFactorized[];

  constructor(private navCtrl: NavController, private navParams: NavParams,
    private translate: TranslateService,
    private mapsProvider: MapsProvider
    ) {

      this.mapsProvider.getDataSensorLocation().subscribe((res: DataMapFactorized[]) => {
        this.dataMapFactorized = res;
        console.log(this.dataMapFactorized);

        this.setMarker();
      });

  }

  ionViewDidLoad(): void {


    //set map center
    this.center = [45.1326, 5.7266]; //Grenoble

    //setup leaflet map
    this.initMap();
  }

  initMap(): void {
    this.map = leaflet.map('map', {
      center: this.center,
      zoom: 6,
      maxZoom: 12
    });

    //Add OSM Layer
    leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  setMarker(): void {
    let gps: leaflet.PointTuple;
    this.dataMapFactorized.forEach((dataMapFactorized: DataMapFactorized) => {
      gps = [dataMapFactorized.latitude, dataMapFactorized.longitude];
      const circle = leaflet.circleMarker(gps, {
        color: 'blue',
        fillColor: '#0033FF',
        fillOpacity: 0.5,
        radius: 30
      }).addTo(this.map);

      let popup = '<div align="center">' + dataMapFactorized.system + '</div>';

      dataMapFactorized.values.forEach((value: DataMapValues) => {
        popup += '<div align="left">' + value.sensor + '</div>';
        popup += '<div align="right">' + value.pollutant + ': ' + value.value + ' ' + value.unit + '</div>';
      });
      popup += '<div align="center">Date :' + dataMapFactorized.date + '</div>';
      circle.bindPopup(popup);
  });
  }
}
