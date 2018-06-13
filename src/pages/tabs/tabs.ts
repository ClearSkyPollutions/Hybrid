import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';


@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root :string = 'ListCityPage';
  tab2Root :string = 'ParametersPage';
  tab3Root :string = 'ListPolluantPage';

  constructor(public translate    : TranslateService) {

  }
}
