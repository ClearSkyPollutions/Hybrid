import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

import { Capteur, InitConfig } from '../../models/init-config.interface';


@IonicPage()
@Component({
  selector: 'page-slides',
  templateUrl: 'slides.html',
})
export class SlidesPage {

  @ViewChild('slides') slides: Slides;
  showSkip                   : boolean = false;
  initialSettings            : InitConfig;
  sensorsList                : Capteur[];


  constructor(
    public translate: TranslateService,
    public navCtrl  : NavController,
    public navParams: NavParams,
    private storage : Storage
  ) {
    // this.initialSettings = {
    //   frequency: 0,
    //   sensors: [],
    //   raspi: {
    //     ipAddress : '',

    //   },
    //   server: {},
    //   isDataShared: false
    // };
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


}
