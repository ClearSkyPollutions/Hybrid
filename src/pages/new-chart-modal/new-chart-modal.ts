import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-new-chart-modal',
  templateUrl: 'new-chart-modal.html',
})
export class NewChartModalPage {

  name: string;
  unit: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewChartModalPage');
  }

  cancelModal(){
    this.navCtrl.pop();
  }

  closeModal() {
    this.viewCtrl.dismiss({name : this.name, unit: this.unit});
  }
}
