import { Injectable } from '@angular/core';
import { AlertController, Alert } from 'ionic-angular';
import { AlertDialog } from '../../models/alert';




@Injectable()
export class AlertProvider {

  constructor(private alertCtrl: AlertController) { }

  basicAlert(options: AlertDialog) :Alert {
    return this.alertCtrl.create({
      title: options.title,
      subTitle: options.message,
      buttons: ['OK']
    });
  }

  confirmAlert(options: AlertDialog) :Alert {
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

  promptAlert(options: AlertDialog) :Alert {
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

  promptAlertbis(options: AlertDialog) : Alert {
    return this.alertCtrl.create({
      title: options.title,
      message: options.message,
      inputs: [
        {
          name: options.input_1.name,
          placeholder: options.input_1.placeholder
        },
        {
          name: options.input_2.name,
          placeholder: options.input_2.placeholder
        }
      ],
      buttons: [
        {
          text: options.button.text,
          handler: options.button.handler
        }
      ]
    });
  }


}
