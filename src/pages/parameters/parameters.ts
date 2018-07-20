import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, LoadingController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { Settings } from '../../models/settings';
import { AlertProvider } from '../../providers/alert/alert.service';
import { SettingsProvider } from '../../providers/settings/settings.service';
import { AddressServer } from '../../models/addressServer.interface';
import { InitConfig } from '../../models/init-config.interface';

@IonicPage()
@Component({
  selector: 'page-parameters',
  templateUrl: 'parameters.html',
})
export class ParametersPage {
  raspi: AddressServer;
  settings: Settings;
  storedConf: InitConfig;
  tempInputSensor: string;
  spinner: any;
  connection: boolean;

  constructor(
    public navCtrl          : NavController,
    public translate        : TranslateService,
    private alertProvider   : AlertProvider,
    private settingsProvider: SettingsProvider,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private storage: Storage
  ) {
    this.connection = false;
    this.raspi = {
      ip: '',
      port: ''
    };
    this.settings = {
      frequency: 20,
      isDataShared: false,
      sensors: [],
      serverAddress: this.raspi
    };
  }

  ionViewDidLoad() :void {
    //if (this.isEmptyAddress()) {
    //  this.addressServerDialog();
    //  return;
    //}
    this.storage.get('initConfig').then((val : InitConfig) => {
      this.settings = {
        frequency: 20,
        sensors: val.sensors,
        serverAddress: val.server_ip,
        isDataShared: val.isDataShared
      };
      this.showSpinner();
      this.raspi = val.rasp_ip;
      this.settingsProvider.getConfig(this.raspi).subscribe(
        (cfg: Settings) => {
          this.spinner.dismiss();
          this.showToast('Local settings synced with the Raspberry Pi');
          this.settings = cfg;
          this.storedConf.isDataShared = this.settings.isDataShared;
          this.storedConf.sensors = this.settings.sensors;
          this.storedConf.server_ip = this.settings.serverAddress;
          this.storedConf.rasp_ip = this.raspi;
          this.storage.set('initConfig', this.storedConf);
        },
        (error : any) => {
          this.connection = false;
          console.log('Couldn\'t fetch remote settings', error);
          this.spinner.dismiss();
          this.showToast('Using last known settings');
          if (!this.connection) {
           //this.addressServerDialog();
          }
        }
      );
    });
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
      position: 'bottom',
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

  isEmptyAddress() : boolean {
    if (this.raspi.ip != '' && this.raspi.port != '') {
      return false;
    }
    else {
      return true;
    }
  }

  doConfirm() :void {
    this.alertProvider.confirmAlert({
      title: 'Confirm these changes?',
      message: 'Be careful when changing wifi configuration remotely,\nyou may need to connect physically to the Raspberry Pi\nif an error occurs',
      buttons:
      [{
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
              this.spinner.dismiss();
              this.showToast('Connected successfully to the Raspberry Pi');
              this.connection = true;
              this.storedConf.isDataShared = this.settings.isDataShared;
              this.storedConf.sensors = this.settings.sensors;
              this.storedConf.server_ip = this.settings.serverAddress;
              this.storedConf.rasp_ip = this.raspi;
              this.storage.set('initConfig', this.storedConf);
            },
            (error : any) => {
              this.connection = false;
              console.log('Couldn\'t fetch remote settings', error);
              this.spinner.dismiss();
              this.showToast('Couldn\'t connect to Raspberry Pi. Please try new address');
              if (!this.connection) {
                //this.addressServerDialog();
              }
            }
          );
        }
      }]
    }).present();
  }

  addressServerDialog(): void {
    this.alertProvider.promptAlertbis({
      title: 'Raspberry Pi',
      message: 'The IP address and server port are invalid. \nPlease, correct them to configure your Raspberry Pi.',
      inputs:
      [{
        name:'ip',
        type: 'text',
        placeholder: 'IP address',
      },
      {
        name: 'port',
        type: 'text',
        placeholder: 'Port',
      }],
      buttons:
      [{
          text: 'OK',
          handler: (data:any) :void => {
            this.raspi.ip = data.ip;
            this.raspi.port = data.port;
            this.ionViewDidLoad();
        }
      }]
    }).present();
  }

}