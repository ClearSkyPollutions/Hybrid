import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';

import { Mesure } from '../../models/mesure';
import { MesureProvider } from '../../providers/mesure/mesure';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  mesures: Mesure[];
  
  constructor(public navCtrl: NavController,
              private mesureProvider : MesureProvider) {

        this.showLastMesure();
  }

  showLastMesure(){
    this.mesureProvider.getLastMesure().subscribe(
      data => {
        this.mesures = data['Concentration_pm'];
      }
    );        
  }

}
