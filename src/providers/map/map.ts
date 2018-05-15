import { Injectable } from '@angular/core';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions
} from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';

@Injectable()
export class MapProvider {

  map: GoogleMap;

  constructor(private geolocation: Geolocation) {
    console.log('Hello MapProvider Provider');
  }


  public getUserPosition (htmlElement: string) {
      this.geolocation.getCurrentPosition().then((resp) => {
        this.loadMap(htmlElement,resp.coords);
      }).catch((error) => {
        console.log('Error getting location', error);
      });
    }


  private loadMap(htmlElement: string, position: any) {

    let mapOptions: GoogleMapOptions = {
      camera: {
         target: {
           lat: position.latitude,
           lng: position.longitude
         },
         zoom: 12
       }
     };
    this.map = GoogleMaps.create(htmlElement, mapOptions);

    this.map.one(GoogleMapsEvent.MAP_READY).then(
      () => {
        console.log('Map is ready!');
      }
    );
 }
}
