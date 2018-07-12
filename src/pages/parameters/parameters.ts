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
  settings: any;

  tempInputSensor: string;

  spinner: any;

  constructor(
    public navCtrl          : NavController,
    public translate        : TranslateService,
    private alertProvider   : AlertProvider,
    private settingsProvider: SettingsProvider,
    private toastCtrl       : ToastController,
    private loadingCtrl     : LoadingController
  ) {
    this.settings = {
      frequency: 0,
      sensors  : []
    };

  }

  ionViewDidLoad() :void {
    this.showSpinner();
    this.settingsProvider.getConfig().subscribe(
      (cfg: Settings) => {
        this.settings = cfg;
        this.spinner.dismiss();
      },
      (error : any) => {
        console.log('Couldn\'t fetch remote settings', error);
        this.showToast('Couldn\'t connect to server');
        this.spinner.dismiss();
      }
    );
  }

  removeSensor(oldSensor: string) :void {
    console.log('Removed sensor' + oldSensor);
    this.settings.sensors = this.settings.sensors.filter((elem : string) =>
       (elem != oldSensor));
  }

  addSensor():void {
    if (this.tempInputSensor) {
      this.settings.sensors.push(this.tempInputSensor);
    }
    this.tempInputSensor = '';
  }

  showToast(msg: string) :void {
    const toast = this.toastCtrl.create({
      position: 'middle',
      message: msg,
      duration: 3000
    });
    toast.present();
  }

  showSpinner() :void {
    this.spinner = this.loadingCtrl.create({
      content: 'Connecting to server...'
    });
    this.spinner.present();
  }

  doConfirm() :void {
    this.alertProvider.confirmAlert({
      title: 'Confirm these changes ?',
      message: 'Be careful when changing wifi configuration remotely, you may need to connect physically to the Raspberry Pi if an error occurs',
      buttons:[
      {
        text: 'Cancel',
        handler: () :void => {
          console.log('Cancelled configuration changes');
        }
      },
      {
        text: 'Accept',
        handler: () :void => {
          console.log('Configuration changed');
          this.showSpinner();
          this.settingsProvider.setConfig(this.settings).subscribe(
            (cfg: Settings) => { this.spinner.dismiss(); },
            (error : any) => {
              this.showToast('Couldn\'t connect to system');
              this.spinner.dismiss();
            }
          );
        }
      }
    ]}).present();
  }

}
