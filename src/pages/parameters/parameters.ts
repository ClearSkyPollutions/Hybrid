import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, LoadingController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { Settings } from '../../models/settings';
import { AlertProvider } from '../../providers/alert/alert.service';
import { SettingsProvider } from '../../providers/settings/settings.service';
import { AddressServer } from '../../models/addressServer.interface';
import { StoredConf } from '../../models/init-config.interface';
import { System } from '../../models/system';
import { Geolocation } from '@ionic-native/geolocation';

@IonicPage()
@Component({
  selector: 'page-parameters',
  templateUrl: 'parameters.html',
})
export class ParametersPage {
  raspi: AddressServer;
  settings: Settings;
  storedConf: StoredConf;
  system : System;
  tempInputSensor: string;
  spinner: any;
  connection: boolean;
  isPositionShared: boolean;
  latitude : string;
  longitude : string;

  constructor(
    public navCtrl          : NavController,
    public translate        : TranslateService,
    private alertProvider   : AlertProvider,
    private settingsProvider: SettingsProvider,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    private geolocation : Geolocation
  ) {
    this.raspi = {
      ip: '',
      port: ''
    };
    this.settings = {
      frequency: 20,
      sensors: [],
      serverAddress: this.raspi,
      isDataShared: false,
      latitude: '-1',
      longitude: '-1'
    };
    this.isPositionShared = false;
  }

  ionViewDidLoad() :void {
    this.storage.get('initConfig').then((val : StoredConf) => {
      this.settings.frequency = val.frequency;
      this.settings.sensors = val.sensors;
      this.settings.serverAddress = val.server_ip;
      this.settings.isDataShared = val.isDataShared;
      this.raspi = val.rasp_ip;
      this.showSpinner();
      this.settingsProvider.getConfig(this.raspi).subscribe(
        (cfg: Settings) => {
          this.spinner.dismiss();
          this.showToast('Local settings synced with the Raspberry Pi');
          this.settings = {
            frequency     : cfg.frequency,
            sensors       : cfg.sensors,
            serverAddress : cfg.serverAddress,
            isDataShared  : cfg.isDataShared,
            latitude      : '-1',
            longitude     : '-1'
          };
          this.storedConf = {
            frequency   : this.settings.frequency,
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
          this.showToast('Using last known settings');
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

  getPosition() : void {
    if (this.isPositionShared) {
      console.log('isPositionShared = true');
      this.geolocation.getCurrentPosition().then((resp : any) => {
        console.log('in getCurrentPosition().then()');
        console.log(resp);
        this.latitude  = String(resp['coords']['latitude']);
        this.longitude = String(resp['coords']['longitude']);
        this.storage.get('system').then((sys : any) => {
          sys['latitude'] = this.latitude;
          sys['longitude'] = this.longitude;
          this.storage.set('system', sys);
        });
       }).catch((error : any) => {
         console.log('Error getting location', error);
       });
    }
  }

  setPositionCheckboxValue() : void {
    if (!this.settings.isDataShared) {
      this.isPositionShared = false;
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
          try {
              if (this.isPositionShared && this.settings.isDataShared) {
                this.settings.latitude = this.latitude;
                this.settings.longitude = this.longitude;
              } else {
                this.settings.latitude = '-1';
                this.settings.longitude = '-1';
              }
              console.log(this.settings);
              this.storage.get('system').then((sys : any) => {
                sys['latitude'] = this.latitude;
                sys['longitude'] = this.longitude;
                this.storage.set('system', sys);
            });
              this.settingsProvider.setConfig(this.settings, this.raspi).subscribe(
                () => {
                  console.log(this.settings);
                  this.spinner.dismiss();
                  this.showToast('Connected successfully to the Raspberry Pi');
                  this.storedConf = {
                    frequency   : this.settings.frequency,
                    sensors     : this.settings.sensors,
                    rasp_ip     : this.raspi ,
                    server_ip   : this.settings.serverAddress,
                    isDataShared: this.settings.isDataShared
                  };
                  this.storage.set('initConfig', this.storedConf);
                }, (error : any) => {
                  console.log('Couldn\'t fetch remote settings', error);
                  this.spinner.dismiss();
                  this.showToast('Couldn\'t connect to Raspberry Pi. Please try new address');
                });
          } catch (error) {
            this.showToast('Invalid address');
          }
        }
      }]
    }).present();
  }
}