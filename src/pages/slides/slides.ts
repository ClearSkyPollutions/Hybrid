import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { SLIDES } from '../../configs/slides.data';


@IonicPage()
@Component({
  selector: 'page-slides',
  templateUrl: 'slides.html',
})
export class SlidesPage {

  slides = SLIDES;
  constructor(public translate    : TranslateService,
    public navCtrl: NavController, public navParams: NavParams) {
  }

  startApp() :void {
    this.navCtrl.setRoot('TabsPage', {}, {
      animate: true,
      direction: 'forward'
    });
  }

}
