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
    this.raspi = {
      ip: '',
      port: ''
    };
    this.settings = {
      frequency: 20,
      sensors: [],
      serverAddress: this.raspi,
      isDataShared: false
    };
  }

  ionViewDidLoad() :void {
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
          this.showToast(this.translate.instant('param_sync_toast'));
          this.settings = cfg;
          this.storedConf = {
            sensors     : this.settings.sensors,
            rasp_ip     : this.raspi ,
            server_ip   : this.settings.serverAddress,
            isDataShared: this.settings.isDataShared
          };
          this.storage.set('initConfig', this.storedConf);
        },
        (error : any) => {
          console.log('Couldn\'t fetch remote settings', error);
          this.spinner.dismiss();
          this.showToast(this.translate.instant('param_syncfailed_toast'));
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
      content: this.translate.instant('param_spinner_toast')
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
      title: this.translate.instant('param_alert_title'),
      message: this.translate.instant('param_alert_message'),
      buttons:
      [{
        text: this.translate.instant('param_alertcancel_btn'),
        handler: () :void => {
          this.showToast(this.translate.instant('param_alert_cancel'));
        }
      },
      {
        text: this.translate.instant('param_alertconfirm_btn'),
        handler: () :void => {
          this.showSpinner();
          try {
            this.settingsProvider.setConfig(this.settings, this.raspi).subscribe(
              (cfg: Settings) => {
                this.spinner.dismiss();
                this.showToast(this.translate.instant('param_alert_success'));
                this.storedConf = {
                  sensors     : this.settings.sensors,
                  rasp_ip     : this.raspi ,
                  server_ip   : this.settings.serverAddress,
                  isDataShared: this.settings.isDataShared
                };
                this.storage.set('initConfig', this.storedConf);
              },
              (error : any) => {
                console.log("Couldn\'t fetch remote settings", error);
                this.spinner.dismiss();
                this.showToast(this.translate.instant('param_alertconnection_failed'));
              }
            );
          } catch (error) {
            this.showToast(this.translate.instant('param_alert_failed'));
          }
        }
      }]
    }).present();
  }
}