import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { MapsProvider } from '../../providers/maps/maps.service';
import leaflet from 'leaflet';
import { DataMapFactorized, DataMapValues } from '../../models/dataMaps.interface';
import { Storage } from '@ionic/storage';
import { InitConfig } from '../../models/init-config.interface';


@IonicPage()
@Component({
  selector   : 'page-maps',
  templateUrl: 'maps.html',
})
export class MapsPage {
  map   : leaflet.Map;
  center: leaflet.PointTuple;
  dataMapFactorized: DataMapFactorized[];

  constructor(private navCtrl: NavController, private navParams: NavParams,
    private translate   : TranslateService,
    private mapsProvider: MapsProvider,
    private storage: Storage
    ) {
      this.storage.get('initConfig').then((val : InitConfig) => {
        this.mapsProvider.getDataSensorLocation(val.server_ip).subscribe((res: DataMapFactorized[]) => {
          this.dataMapFactorized = res;
          console.log(this.dataMapFactorized);
          this.setMarker();
        });
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
      zoom       : 6,
      zoomControl: false,
      maxZoom    :  12
    });

    //Add OSM Layer
    leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  setMarker(): void {
    let gps: leaflet.PointTuple;
    const dateTimeOptions = {
      weekday: 'short',
      year   : 'numeric',
      month  : 'short',
      day    : 'numeric',
      hour   : '2-digit',
      minute : '2-digit'
    };

    this.dataMapFactorized.forEach((dataMapFactorized: DataMapFactorized) => {
      gps = [dataMapFactorized.latitude, dataMapFactorized.longitude];
      const circle = leaflet.circleMarker(gps, {
        color      : '#488aff',
        fillColor  : '#488aff',
        fillOpacity: 0.5,
        radius     : 30
      }).addTo(this.map);

      let popupContent = '<div align="center"><b>' + dataMapFactorized.system + '</b></div><br>';

      dataMapFactorized.values.forEach((value: DataMapValues) => {
        popupContent += '<div align="left"><b>' + value.pollutant.toUpperCase() + ': </b>' + value.value + ' ' + value.unit + '</div>';
      });

      popupContent += '<div align="right"><br>Date: ' + dataMapFactorized.date.toLocaleString(this.translate.getBrowserLang(), dateTimeOptions) + '</div>';

      circle.bindPopup(popupContent, {
          'maxWidth'    : 500,
          'minWidth'    : 150,
          'autoPan'     : true,
          'closeButton' : false,
          'closeOnClick': true,
          'className'   : 'popupCustom'
        });
  });
  }
}
