import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, ToastController, LoadingController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

import { InitConfig } from '../../models/init-config.interface';
import { AlertProvider } from '../../providers/alert/alert.service';
import { SettingsProvider } from '../../providers/settings/settings.service';
import { Settings } from '../../models/settings';



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

  initialSettings: InitConfig;
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
    private toastCtrl    : ToastController
    ) {
    this.initialSettings = {
      sensors     : [''],
      rasp_ip     : { ip: '192.168.0.', port: '80'},
      server_ip   : { ip: '192.168.2.118', port: '80'},
      isDataShared: false,
    };
  }

  startApp() :void {
    this.initialSettings.sensors = this.getSelectedSensors();
    console.log(this.initialSettings);
    this.storage.set('hasSeenTutorial', true);
    this.storage.set('initConfig', this.initialSettings).then((val : InitConfig) => {
      this.newSettings = {
        sensors: val.sensors,
        frequency: 20,
        serverAddress: val.server_ip,
        isDataShared: val.isDataShared
      };
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
                this.isAbleToStart = true;
                this.showStartBtn = true;
                this.spinner.dismiss();
              }, (error : any) => {
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




}
