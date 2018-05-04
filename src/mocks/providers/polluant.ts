import { Injectable } from '@angular/core';

import { Polluant } from '../../models/polluant';

@Injectable()
export class PolluantProvider {

  polluants: Polluant[] = [];

  constructor() {
    let polluantsInfo = [
      {
        "name": "PM2.5",
        "image": "assets/imgs/polluants/pm25.jpg",
        "desc": "Primary sources: Habitation (coal fire, kitchen, etc) \nHealth effects :  Asthma, lung cancer, cardio-respiratory diseases, adverse pregnancy outcomes. It corresponds to thoracic particles which reach bronchi."
      },
      {
        "name": "PM10",
        "image": "assets/imgs/polluants/pm10.jpg",
        "desc": "Primary sources: Habitation, industry, farming, road traffic. \nHealth effects : Asthma, lung cancer, cardio-respiratory diseases, adverse pregnancy outcomes. It corresponds to inhalable particle that doesn't reach the lungs and thoracic particles which are not filtered by the cilia."
      },
      {
        "name": "Nitrogne oxide",
        "image": "assets/imgs/polluants/nox.jpg",
        "desc": "Primary sources Road traffic. \nHealth effects : Respiratory diseases, bronchial irritation, increased asthmatic reactions in children."
      },
      {
        "name": "Sulfur dioxide",
        "image": "assets/imgs/polluants/so2.jpg",
        "desc": "Primary sources: Industry. \nHealth effects : Breathing difficulties, increased asmathic sensitivity, gastric irritations, itches, hot flashes, death in case of strong intoxication."
      },
      {
        "name": "Carbon monoxide",
        "image": "assets/imgs/polluants/pm25.jpg",
        "desc": "Primary sources: Habitation, industry. \nHealth effects :  It has no taste or smell and cannot be seen but can be lethal for human. It reduces the amount of oxygen transported to vital organs leading to headaches, clumsyness,  loss of consciousness and eventually death."
      },
      {
        "name": "Noise",
        "image": "assets/imgs/polluants/noise.jpg",
        "desc": "Primary sources: Depends mostly on the location. \nHealth effects : hearing loss, sleep disturbances, high blood pressure, heart attack, strokes."
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
