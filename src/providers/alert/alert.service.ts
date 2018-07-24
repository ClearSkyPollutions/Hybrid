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
          text: options.buttons[0].text,
          handler: options.buttons[0].handler
        },
        {
          text: options.buttons[1].text,
          handler: options.buttons[1].handler
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
          name: options.inputs[0].name,
          placeholder: options.inputs[0].placeholder
        },
      ],
      buttons: [
        {
          text: options.buttons[0].text,
          handler: options.buttons[0].handler
        },
        {
          text: options.buttons[1].text,
          handler: options.buttons[1].handler
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
          name: options.inputs[0].name,
          value: options.inputs[0].value,
          placeholder: options.inputs[0].placeholder,
          type: options.inputs[0].type
        },
        {
          name: options.inputs[1].name,
          value: options.inputs[1].value,
          placeholder: options.inputs[1].placeholder,
          type: options.inputs[1].type
        }
      ],
      buttons: [
        {
          text: options.buttons[0].text,
          handler: options.buttons[0].handler
        }
      ]
    });
  }
}
