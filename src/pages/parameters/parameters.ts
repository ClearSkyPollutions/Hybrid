import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { Settings } from '../../models/settings';

import { AlertProvider } from '../../providers/alert/alert.service';
import { SettingsProvider } from '../../providers/settings/settings.service';

@IonicPage()
@Component({
  selector: 'page-parameters',
  templateUrl: 'parameters.html',
})
export class ParametersPage {

  settings : Settings = {
    freq: 0,
    wifiSSID: "",
    wifiPWD: "",
    sensors: ["SDS011", "DHT22"]
  };

  tempInputSensor : string;

  constructor(
    public navCtrl      : NavController,
    public translate    : TranslateService,
    private alertProvider: AlertProvider,
    private settingsProvider: SettingsProvider
    ) {

       this.settingsProvider.getConfig().subscribe( cfg => {
         this.settings = cfg;
       })
    }
  
  removeSensor(oldSensor : string){
    console.log("Added sensor " + oldSensor);
    this.settings.sensors = this.settings.sensors.filter( elem => {
      return (elem != oldSensor);
    });
  }

  addSensor(){
    if (this.tempInputSensor){
      this.settings.sensors.push(this.tempInputSensor);
    }
    this.tempInputSensor = "";
  }

  doConfirm() {
    this.alertProvider.confirmAlert({
      title: 'Confirm these changes ?',
      message: 'Be careful when changing wifi configuration remotely, you may need to connect physically to the Raspberry Pi if an error occurs',
      button_1: 
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancelled configuration changes')
          }
        },
        button_2: {
          text: 'Accept',
          handler: () => {
            console.log('Configuration changed')
        }
      }
    }).present()
  }

}
