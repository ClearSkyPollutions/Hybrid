import { Injectable } from '@angular/core';

import { Alert } from '../../models/alert';
import { AlertController } from 'ionic-angular';



@Injectable()
export class AlertProvider {

  constructor(private alertCtrl: AlertController) { }

  basicAlert(options: Alert)  {
    return this.alertCtrl.create({
      title: options.title,
      subTitle: options.message,
      buttons: ['OK']
    });
  }

  confirmAlert(options: Alert) {
    return this.alertCtrl.create({
      title: options.title,
      message: options.message,
      buttons: [
        {
          text: options.button_1.text,
          handler: options.button_1.handler
        },
        {
          text: options.button_2.text,
          handler: options.button_2.handler
        }
      ]
    });
  }

  promptAlert(options: Alert) {
    return this.alertCtrl.create({
      title: options.title,
      message: options.message,
      inputs: [
        {
          name: options.input.name,
          placeholder: options.input.placeholder
        },
      ],
      buttons: [
        {
          text: options.button_1.text,
          handler: options.button_1.handler
        },
        {
          text: options.button_2.text,
          handler: options.button_2.handler
        }
      ]
    });
  }


}
