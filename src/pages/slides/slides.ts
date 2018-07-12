import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

import { InitConfig } from '../../models/init-config.interface';
import { AlertProvider } from '../../providers/alert/alert.service';
import { Sensor } from '../../models/sensor.interface';
import { SENSORS } from '../../configs/sensors.data';


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
  sensorsList    : Sensor[] = SENSORS;


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
      server_ip   : { ip: '', port: ''},
      isDataShared: true,
    };
  }

  startApp() :void {
    console.log(this.initialSettings);
    this.navCtrl.push('TabsPage', {}, {
      animate  : true,
      direction: 'forward'
    }).then(() => {
      this.storage.set('initiConfig', this.initialSettings);
      //this.storage.set('hasSeenTutorial', true);
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

  DefineIpAddressDialog(deviceName : string, x: string) :void {
    this.alertProvider.promptAlertbis({
      title: deviceName,
      message: 'Enter the IP address of your ' + deviceName,
      inputs: [
      {
        name:'ip',
        type: 'text',
        placeholder: 'IP address',
      },
      {
        name: 'port',
        type: 'text',
        placeholder: 'Port',
      }],
      buttons:[
      {
        text: 'OK',
        handler: (data:any) :void => {
          if (data) {
            this.initialSettings[x].ip = data.ip;
            this.initialSettings[x].port = data.port;
          }
        }
      }]
    }).present();
  }


}
