import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, LoadingController } from 'ionic-angular';
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

  spinner: any;

  constructor(
    public navCtrl: NavController,
    public translate: TranslateService,
    private alertProvider: AlertProvider,
    private settingsProvider: SettingsProvider,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
    this.settings = {
      Frequency: 0,
      SSID: "",
      Password: "",
      SecurityType: "WPA-PSK",
      Sensors: []
    };

  }

  ionViewDidLoad() {
    this.showSpinner();
    this.settingsProvider.getConfig().subscribe(
      (cfg: Settings) => {
        this.settings = cfg;
        console.log(cfg);
        this.spinner.dismiss();
      },
      error => {
        console.log("Couldn't fetch remote settings");
        this.showToast("Couldn't connect to server");
        this.spinner.dismiss();
      }
    )
  }

  removeSensor(oldSensor: string) {
    console.log("Added sensor " + oldSensor);
    this.settings.Sensors = this.settings.Sensors.filter(elem => {
      return (elem != oldSensor);
    });
  }

  addSensor() {
    if (this.tempInputSensor) {
      this.settings.Sensors.push(this.tempInputSensor);
    }
    this.tempInputSensor = "";
  }

  showToast(msg: string) {
    const toast = this.toastCtrl.create({
      position: "middle",
      message: msg,
      duration: 3000
    })
    toast.present();
  }

  showSpinner() {
    this.spinner = this.loadingCtrl.create({
      content: 'Connecting to server...'
    })
    this.spinner.present();
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
          this.showSpinner();
          this.settingsProvider.setConfig(this.settings).subscribe(
            (cfg: Settings) => { this.spinner.dismiss(); },
            error => {
              this.showToast("Couldn't connect to system");
              this.spinner.dismiss();
            }
          );
        }
      }
    }).present()
  }

}
