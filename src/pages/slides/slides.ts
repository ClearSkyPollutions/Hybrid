import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

import { InitConfig } from '../../models/init-config.interface';
import { AlertProvider } from '../../providers/alert/alert.service';



@IonicPage()
@Component({
  selector: 'page-slides',
  templateUrl: 'slides.html',
})
export class SlidesPage {

  @ViewChild('slides') slides: Slides;
  showPreviousBtn: boolean   = false;
  showNextBtn    : boolean   = true;

  initialSettings: InitConfig;
  sensorsList    : any[] = [
    {name: 'PMS5003', checked   : false},
    {name: 'MQ-2', checked      : false},
    {name: 'DHT22', checked     : false},
    {name: 'MISC', checked      : false},
    {name: 'Microphone', checked: false}
  ];


  constructor(
    public translate     : TranslateService,
    public navCtrl       : NavController,
    public navParams     : NavParams,
    private storage      : Storage,
    private alertProvider: AlertProvider
  ) {
    this.initialSettings = {
      sensors     : [''],
      rasp_ip     : { ip: '', port: ''},
      server_ip   : { ip: '192.168.2.118', port: '80'},
      isDataShared: false,
    };
  }

  startApp() :void {
    this.initialSettings.sensors = this.getSelectedSensors();
    console.log(this.initialSettings);

    this.navCtrl.push('TabsPage', {}, {
      animate  : true,
      direction: 'forward'
    }).then(() => {
      this.storage.set('initConfig', this.initialSettings);
      this.storage.set('hasSeenTutorial', true);
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
    this.alertProvider.promptAlertbis({
      title: serverName,
      message: 'Enter the IP address of your ' + serverName,
      inputs: [
      {
        name:'ip',
        type: 'text',
        placeholder: (this.initialSettings[server].ip == '') ? 'IP' : this.initialSettings[server].ip,
      },
      {
        name: 'port',
        type: 'text',
        placeholder: (this.initialSettings[server].port == '') ? 'Port' : this.initialSettings[server].port,
      }],
      buttons:[
      {
        text: 'OK',
        handler: (data:any) :void => {
          if (data) {
            this.initialSettings[server].ip = data.ip;
            this.initialSettings[server].port = data.port;
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
