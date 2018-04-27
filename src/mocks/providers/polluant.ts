import { Injectable } from '@angular/core';

import { Polluant } from '../../models/polluant';

@Injectable()
export class PolluantProvider {

  polluants: Polluant[] = [];

  constructor() {
    let polluantsInfo = [
      {
        "name": "PM2.5",
        "image": "assets/imgs/polluants/1.jpg",
        "desc": "Burt is a Bear."
      },
      {
        "name": "PM10",
        "image": "assets/imgs/polluants/4.jpg",
        "desc": "Charlie is a Cheetah."
      },
      {
        "name": "Monoxyde de carbone",
        "image": "assets/imgs/polluants/2.jpg",
        "desc": "Donald is a Duck."
      },
      {
        "name": "Dioxyde de carbone",
        "image": "assets/imgs/polluants/3.jpg",
        "desc": "Eva is an Eagle."
      },
      {
        "name": "Oxyde d'Azote",
        "image": "assets/imgs/polluants/5.jpg",
        "desc": "Ellie is an Elephant."
      },
      {
        "name": "Ozone",
        "image": "assets/imgs/polluants/4.jpg",
        "desc": "Paul is a Puppy."
      }
    ];

    for (let p of polluantsInfo) {
      this.polluants.push(new Polluant(p));
    }
  }

  getPolluantsDescription(){
    return this.polluants;
  }

}
