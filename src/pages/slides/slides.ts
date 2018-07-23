import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

import { InitConfig } from '../../models/init-config.interface';
import { AlertProvider } from '../../providers/alert/alert.service';
import { SettingsProvider } from '../../providers/settings/settings.service';



@IonicPage()
@Component({
  selector: 'page-slides',
  templateUrl: 'slides.html',
})
export class SlidesPage {

  @ViewChild('slides') slides: Slides;
  showPreviousBtn: boolean   = false;
  showNextBtn    : boolean   = true;
  isAbleToStart  : boolean   = false;

  initialSettings: InitConfig;
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
    if (this.isAbleToStart) {
      this.navCtrl.push('TabsPage', {}, {
        animate  : true,
        direction: 'forward'
      }).then(() => {
        this.storage.set('initConfig', this.initialSettings);
        this.storage.set('hasSeenTutorial', true);
      });
    }
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
          if (data) {
            if (server == 'rasp_ip') {
              this.settProvider.getConfig(data).subscribe(() => {
                this.initialSettings[server].ip = data.ip;
                this.initialSettings[server].port = data.port;
                this.isAbleToStart = true;
              }, (error : any) => {
                console.log('Could not reach the server', error);
                this.isAbleToStart = false;
              });
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




}
