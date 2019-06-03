import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { Settings } from '../../models/settings';
import { AlertProvider } from '../../providers/alert/alert.service';
import { SettingsProvider } from '../../providers/settings/settings.service';
import { AddressServer } from '../../models/addressServer.interface';
import { StoredConf } from '../../models/init-config.interface';
import { System } from '../../models/system';
import { Geolocation } from '@ionic-native/geolocation';
import { BluetoothProvider } from '../../providers/bluetooth/bluetooth';
import {InitArdnuino } from '../../models/InitArduino';

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
  latitude : number;
  longitude : number;
  activeSegment: string = 'Clear_SKY_2_0';
  Sendfrequency: number;
  initArdnuino: InitArdnuino[]=[ {latitude: 45.188529,longitude:5.724524,frequency:24}];
 


  constructor(
    public navCtrl          : NavController,
    public translate        : TranslateService,
    private alertProvider   : AlertProvider,
    private settingsProvider: SettingsProvider,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    private geolocation : Geolocation,    
    private bluetoothProvider: BluetoothProvider 
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
      latitude: null,
      longitude: null
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
          this.showToast(this.translate.instant('param_sync_toast'));
          this.settings = {
            frequency     : cfg.frequency,
            sensors       : cfg.sensors,
            serverAddress : cfg.serverAddress,
            isDataShared  : cfg.isDataShared,
            latitude      : null,
            longitude     : null
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

  getPosition() : void {
    console.log("la")
    if (this.isPositionShared) {
      console.log('isPositionShared = true');
      this.geolocation.getCurrentPosition().then((resp : any) => {
        console.log('in getCurrentPosition().then()');
        console.log(resp);
        this.latitude  = resp['coords']['latitude'];
        this.longitude = resp['coords']['longitude'];        
        this.storage.get('system').then((sys : any) => {
          sys['latitude'] = this.latitude;
          sys['longitude'] = this.longitude;
          console.log(this.longitude);
        console.log(this.latitude);
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
              if (this.isPositionShared && this.settings.isDataShared) {
                this.settings.latitude = this.latitude;
                this.settings.longitude = this.longitude;
              } else {
                this.settings.latitude = null;
                this.settings.longitude = null;
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
                  this.showToast(this.translate.instant('param_alert_success'));
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
                this.showToast(this.translate.instant('param_alertconnection_failed'));
                });
          } catch (error) {
            this.showToast(this.translate.instant('param_alert_failed'));
          }
        }
      }]
    }).present();
  }

  catchPosition(){
    this.isPositionShared=true,
    this.getPosition();
    this.initArdnuino[0].latitude= this.latitude;
    this.initArdnuino[0].longitude =this.longitude;


  }

  GotoBluethooth() {
    this.navCtrl.push('BluetoothConnectionPage');
}

catchfrequency(){
    this.initArdnuino[0].frequency=this.Sendfrequency;

}
Senddata(){

  // this.bluetoothProvider.sendData(JSON.parse(this.initArdnuino[]));
  // console.log(JSON.parse(this.initArdnuino));
}

sendstata2(){
  const userStr=JSON.stringify(this.initArdnuino);
 const  test=JSON.parse(userStr);
 console.log(test);

  // this.bluetoothProvider.sendData(JSON.parse(userStr);
  // this.bluetoothProvider.sendData(userStr);
  
}
sendstata3(){
 
  this.bluetoothProvider.sendData('coucou');
  
}
goComparativeChart() {
  this.navCtrl.push('ComparativeChartPage');
}

}