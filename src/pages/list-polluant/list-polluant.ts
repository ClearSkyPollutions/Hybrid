import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Polluant } from '../../models/polluant';
import { PolluantProvider } from '../../mocks/providers/polluant';
import { AlertProvider } from '../../providers/alert/alert.service';

@IonicPage()
@Component({
  selector: 'page-list-polluant',
  templateUrl: 'list-polluant.html',
})
export class ListPolluantPage {

  polluants : Polluant[];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private alertProvider: AlertProvider,
    private polluantProvider: PolluantProvider
  ) {
    this.polluants= this.polluantProvider.getPolluantsDescription();
  }

  goToPolluantDetails(p: Polluant){
    this.alertProvider.basicAlert({
      title: p.name,
      message: p.desc
    }).present(); 
  }

}
