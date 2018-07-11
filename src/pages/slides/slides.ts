import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

import { Capteur, InitConfig } from '../../models/init-config.interface';
import { AlertProvider } from '../../providers/alert/alert.service';


@IonicPage()
@Component({
  selector: 'page-slides',
  templateUrl: 'slides.html',
})
export class SlidesPage {

  @ViewChild('slides') slides: Slides;
  showSkip                   : boolean = false;
  initialSettings            : InitConfig;
  sensorsList                : Capteur[] = new Array;


  constructor(
    public translate     : TranslateService,
    public navCtrl       : NavController,
    public navParams     : NavParams,
    private storage      : Storage,
    private alertProvider: AlertProvider
  ) {
    this.sensorsList.push({name: 'MG-2', isUsed: false});
    this.sensorsList.push({name: 'MG-2', isUsed: false});
    this.sensorsList.push({name: 'MG-2', isUsed: false});
    this.sensorsList.push({name: 'MG-2', isUsed: false});
  }

  startApp() :void {
    this.navCtrl.push('TabsPage', {}, {
      animate  : true,
      direction: 'forward'
    }).then(() => {
      this.storage.set('initiConfig', this.initialSettings);
      this.storage.set('hasSeenTutorial', true);
    });
  }

  onSlideChangeStart(slider: Slides) :void {
    this.showSkip = slider.isEnd();
  }

  next() :void {
    this.slides.slideNext();
  }

  prev() :void {
    this.slides.slidePrev();
  }

  DefineIpAddressDialog() :void {
    this.alertProvider.promptAlertbis({
      title: 'Raspberry Pi',
      message: 'Enter the IP address of your Raspberry Pi.',
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
          console.log(data);
        }
      }]
    }).present();
  }


}
