import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, ToastController, LoadingController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

import { StoredConf } from '../../models/init-config.interface';
import { AlertProvider } from '../../providers/alert/alert.service';
import { SettingsProvider } from '../../providers/settings/settings.service';
import { Settings } from '../../models/settings';
import { Geolocation } from '@ionic-native/geolocation';



@IonicPage()
@Component({
  selector: 'page-slides',
  templateUrl: 'slides.html',
})
export class SlidesPage {

  @ViewChild('slides') slides: Slides;
  showPreviousBtn: boolean   = false;
  showNextBtn    : boolean   = true;
  showStartBtn   : boolean   = false;
  isAbleToStart  : boolean   = false;

  initialSettings: StoredConf;
  newSettings    : Settings;
  spinner        : any;
  sensorsList    : any[] = [
    {name: 'PMS5003', checked   : false, help: 'https://www.google.com/search?q=PMS5003'},
    {name: 'MQ-2', checked      : false, help: 'https://www.google.com/search?q=MQ-2'},
    {name: 'DHT22', checked     : false, help: 'https://www.google.com/search?q=DHT22'},
    {name: 'MISC', checked      : false, help: 'https://www.google.com/search?q=MISC'},
    {name: 'Microphone', checked: false, help: 'https://www.google.com/search?q=Microphone'}
  ];


  constructor(
    public translate     : TranslateService,
    public navCtrl       : NavController,
    public navParams     : NavParams,
    private storage      : Storage,
    private alertProvider: AlertProvider,
    private settProvider : SettingsProvider,
    private loadingCtrl  : LoadingController,
    private toastCtrl    : ToastController,
    private geolocation: Geolocation
  ) {
    this.initialSettings = {
      frequency   : 20,
      sensors     : [''],
      rasp_ip     : { ip: '192.168.0.', port: '80'},
      server_ip   : { ip: '192.168.2.118', port: '80'},
      isDataShared: false,
    };
    this.newSettings = {
      frequency: 20,
      sensors     : [''],
      serverAddress   : { ip: '192.168.2.118', port: '80'},
      isDataShared: false,
      latitude: '-1',
      longitude: '-1'
    };
  }

  startApp() :void {
    this.initialSettings.sensors = this.getSelectedSensors();
    this.storage.set('hasSeenTutorial', true);
    this.storage.set('initConfig', this.initialSettings).then((val : StoredConf) => {
      this.newSettings.sensors = val.sensors;
      this.newSettings.serverAddress = val.server_ip;
      this.newSettings.isDataShared = val.isDataShared;
      this.settProvider.setConfig(this.newSettings, val.rasp_ip).subscribe(() => {
        console.log(this.newSettings);
        this.navCtrl.push('TabsPage', {}, {
          animate  : true,
          direction: 'forward'
        });
      });
    });
  }

  onSlideChangeStart(slider: Slides) :void {
    this.showNextBtn     = !slider.isEnd();
    this.showPreviousBtn = !slider.isBeginning();
  }

  next() :void {
    this.slides.slideNext();
  }

  prev() :void {
    this.slides.slidePrev();
  }

  DefineIpAddressDialog(serverName : string, server: string) :void {
    console.log(serverName + ' ' + this.initialSettings[server].ip);
    this.alertProvider.promptAlertbis({
      title: serverName,
      message: 'Enter the IP address of your ' + serverName,
      inputs: [
      {
        name:'ip',
        type: 'text',
        value: this.initialSettings[server].ip,
        placeholder: 'IP Address',
      },
      {
        name: 'port',
        type: 'number',
        value: this.initialSettings[server].port,
        placeholder: 'Port'
      }],
      buttons:
      [{
        text: 'OK',
        handler: (data:any) :void => {
          this.initialSettings[server].ip = data.ip;
          this.initialSettings[server].port = data.port;
          if (server == 'rasp_ip') {
            this.showSpinner();
            try {
              this.settProvider.getConfig(data).subscribe(() => {
                this.settProvider.getSystem(data).subscribe(
                  (sys : any) => {
                    sys['SYSTEM'][0]['latitude'] = this.newSettings.latitude;
                    sys['SYSTEM'][0]['longitude'] = this.newSettings.longitude;
                    this.storage.set('system', sys['SYSTEM'][0]);
                    console.log(sys['SYSTEM'][0]);
                  }
                );
                this.isAbleToStart = true;
                this.showStartBtn = true;
                this.spinner.dismiss();
              }, () => {
                this.spinner.dismiss();
                this.showToast('Could not reach the server, please try an other address');
                this.isAbleToStart = false;
              });
            } catch (error) {
              this.showToast('Invalid address');
              this.isAbleToStart = false;
            }
          }
        }
      }]
    }).present();
  }

  getSelectedSensors(): any[] {
    return this.sensorsList
              .filter((sensor : any) => sensor.checked)
              .map((sensor : any) => sensor.name);
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

  getPosition() : void {
    if (this.initialSettings.isDataShared) {
      this.geolocation.getCurrentPosition().then((resp : any) => {
        console.log(resp);
        console.log(resp['coords']['latitude']);
        this.newSettings.latitude  = String(resp['coords']['latitude']);
        this.newSettings.longitude = String(resp['coords']['longitude']);
       }).catch((error : any) => {
         console.log('Error getting location', error);
       });
    }
  }


}
