import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(public translate    : TranslateService,
    public navCtrl: NavController) {

  }

}
