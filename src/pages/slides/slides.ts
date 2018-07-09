import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';


import { SLIDES } from '../../configs/slides.data';
import { SlideInfo } from '../../models/slideInfo';
import { Settings } from '../../models/settings';


@IonicPage()
@Component({
  selector: 'page-slides',
  templateUrl: 'slides.html',
})
export class SlidesPage {

  @ViewChild('slides') slides: Slides;
  showSkip : boolean = false;
  initialSettings: Settings;


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
      this.storage.set('hasSeenTutorial', 'true');
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
