import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-add-chart',
  templateUrl: 'add-chart.html',
})
export class AddChartPage {

  name: string;
  unit: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController) {
  }

  ionViewDidLoad() :void {
    console.log('ionViewDidLoad AddChartPage');
  }

  cancelModal() :void {
    this.navCtrl.pop();
  }

  closeModal()  :void {
    this.viewCtrl.dismiss({name : this.name, unit: this.unit});
  }
}
