import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core'


@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = 'ListCityPage';
  tab2Root = 'ParametersPage';
  tab3Root = 'ListPolluantPage';

  constructor(public translate    : TranslateService) {

  }
}
