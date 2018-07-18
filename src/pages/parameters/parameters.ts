import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, LoadingController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { URL } from '../../env/env';
import { Settings } from '../../models/settings';
import { AlertProvider } from '../../providers/alert/alert.service';
import { SettingsProvider } from '../../providers/settings/settings.service';
import { AddressServer } from '../../models/addressServer.interface';

@IonicPage()
@Component({
  selector: 'page-parameters',
  templateUrl: 'parameters.html',
})
export class ParametersPage {
  settings: any;
  tempInputSensor: string;
  spinner: any;
  raspi: AddressServer;
  connection: boolean;

  constructor(
    public navCtrl          : NavController,
    public translate        : TranslateService,
    private alertProvider   : AlertProvider,
    private settingsProvider: SettingsProvider,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
  ) {
    this.settings = {
      frequency: 0,
      sensors: [],
      serverAddress: URL.server,
      isDataShared: false
    };
    this.raspi = URL.raspberryPi;
    this.connection = false;
  }

  ionViewDidLoad() :void {
    if (this.isEmptyAddress()) {
      this.addressServerDialog();
      return;
    }
    this.showSpinner();
    this.settingsProvider.getConfig().subscribe(
      (cfg: Settings) => {
        this.settings = cfg;
        URL.server = this.settings.serverAddress;
        this.spinner.dismiss();
      },
      (error : any) => {
        this.connection = false;
        console.log('Couldn\'t fetch remote settings', error);
        this.spinner.dismiss();
        this.showToast('Couldn\'t connect to server');
        if (!this.connection) {
          this.addressServerDialog();
        }
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
      position: 'top',
      message: msg,
      duration: 2000
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
      title: 'Confirm these changes?',
      message: 'Be careful when changing wifi configuration remotely,\nyou may need to connect physically to the Raspberry Pi\nif an error occurs',
      button_1:
      {
        text: 'Cancel',
        handler: () :void => {
          this.showToast('Cancelled configuration changes');
        }
      },
      {
        text: 'Accept',
        handler: () :void => {
          this.showSpinner();
          this.settingsProvider.setConfig(this.settings, this.raspi).subscribe(
            (cfg: Settings) => {
              this.connection = true;
              this.spinner.dismiss();
              this.showToast('Configuration changed');
            },
            (error : any) => {
              this.connection = false;
              console.log('Couldn\'t fetch remote settings', error);
              this.showToast('Couldn\'t connect to server');
              this.spinner.dismiss();
              if (!this.connection) {
                this.addressServerDialog();
              }
            }
          );
        }
      }
    ]}).present();
  }

  isEmptyAddress() : boolean {
    if (URL.raspberryPi.ip != '' && URL.raspberryPi.port != '') {
      return false;
    }
    else {
      return true;
    }
  }

  addressServerDialog(): void {
    this.alertProvider.promptAlertbis({
      title: 'Raspberry Pi',
      message: 'The IP address and server port are invalid. \nPlease, correct them to configure your Raspberry Pi.',
      input_1:
      {
        name:'ip',
        type: 'text',
        placeholder: 'IP address',
      },
      input_2:
      {
        name: 'port',
        type: 'text',
        placeholder: 'Port',
      },
      button:
      {
        text: 'OK',
        handler: (data:any) :void => {
          URL.raspberryPi.ip = data.ip;
          URL.raspberryPi.port = data.port;
          this.ionViewDidLoad();
        }
      }
    }).present();
  }
}
