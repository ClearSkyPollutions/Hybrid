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

  settings: Settings;

  tempInputSensor: string;

  constructor(
    public navCtrl: NavController,
    public translate: TranslateService,
    private alertProvider: AlertProvider,
    private settingsProvider: SettingsProvider
  ) {
    this.settings = {Frequency: 0,
      SSID: '',
      Password: '',
      SecurityType: 'WEP',
      Sensors:[]};
  }

  ionViewDidLoad() :void {
    this.settingsProvider.getConfig().subscribe((cfg: Settings) => {
      this.settings = cfg;
      console.log(cfg);
    });
  }

  removeSensor(oldSensor: string) :void {
    console.log('Removed sensor' + oldSensor);
    this.settings.Sensors = this.settings.Sensors.filter((elem : string) =>
       (elem != oldSensor));
  }

  addSensor():void {
    if (this.tempInputSensor) {
      this.settings.Sensors.push(this.tempInputSensor);
    }
    this.tempInputSensor = '';
  }

  doConfirm() :void {
    this.alertProvider.confirmAlert({
      title: 'Confirm these changes ?',
      message: 'Be careful when changing wifi configuration remotely, you may need to connect physically to the Raspberry Pi if an error occurs',
      button_1:
        {
          text: 'Cancel',
          handler: () :void => {
            console.log('Cancelled configuration changes');
          }
        },
      button_2: {
        text: 'Accept',
        handler: () :void => {
          console.log('Configuration changed');
          this.settingsProvider.setConfig(this.settings).subscribe((cfg : Object) => {
            console.log(cfg);
          });
        }
      }
    }).present();
  }

}
