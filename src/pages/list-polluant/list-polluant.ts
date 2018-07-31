import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { Polluant } from '../../models/polluant';
import { PolluantProvider } from '../../mocks/providers/polluant';
import { AlertProvider } from '../../providers/alert/alert.service';
import { Sensor } from '../../models/sensor.interface';
import { SENSORS } from '../../configs/sensors.data';

@IonicPage()
@Component({
  selector: 'page-list-polluant',
  templateUrl: 'list-polluant.html',
})
export class ListPolluantPage {

  polluants    : Polluant[];
  sensors      : Sensor[];
  activeSegment: string = 'pollutants';

  constructor(public translate    : TranslateService,
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertProvider: AlertProvider,
    private polluantProvider: PolluantProvider
  ) {
    this.polluants = this.polluantProvider.getPolluantsDescription();
    this.sensors = SENSORS;
  }

  goToPolluantDetails(p: Polluant): void {
    this.alertProvider.basicAlert({
      title: this.translate.instant(p.name),
      message: this.translate.instant(p.desc)
    }).present();
  }

  goToSensorDetails(s: Sensor): void {
    this.alertProvider.basicAlert({
      title: s.name,
      message: this.translate.instant(s.desc)
    }).present();
  }

}
