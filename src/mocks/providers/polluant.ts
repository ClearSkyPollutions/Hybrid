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
        "desc": "<b>Primary sources:</b> Habitation (coal fire, kitchen, etc) <p><b>Health effects:</b> Asthma, lung cancer, cardio-respiratory diseases, adverse pregnancy outcomes. It corresponds to thoracic particles which reach bronchi.</p>"
      },
      {
        "name": "PM10",
        "image": "assets/imgs/polluants/pm10.jpg",
        "desc": "<b>Primary sources:</b> Habitation, industry, farming, road traffic. <p><b>Health effects:</b> Asthma, lung cancer, cardio-respiratory diseases, adverse pregnancy outcomes. It corresponds to inhalable particle that doesn't reach the lungs and thoracic particles which are not filtered by the cilia.</p>"
      },
      {
        "name": "Nitrogne oxide",
        "image": "assets/imgs/polluants/nox.jpg",
        "desc": "<b>Primary sources:</b> Road traffic. <p><b>Health effects:</b> Respiratory diseases, bronchial irritation, increased asthmatic reactions in children.</p>"
      },
      {
        "name": "Sulfur dioxide",
        "image": "assets/imgs/polluants/so2.jpg",
        "desc": "<b>Primary sources:</b> Industry. <p><b>Health effects:</b> Breathing difficulties, increased asmathic sensitivity, gastric irritations, itches, hot flashes, death in case of strong intoxication.</p>"
      },
      {
        "name": "Carbon monoxide",
        "image": "assets/imgs/polluants/pm25.jpg",
        "desc": "<b>Primary sources:</b> Habitation, industry. <p><b>Health effects:</b>  It has no taste or smell and cannot be seen but can be lethal for human. It reduces the amount of oxygen transported to vital organs leading to headaches, clumsyness,  loss of consciousness and eventually death.</p>"
      },
      {
        "name": "Noise",
        "image": "assets/imgs/polluants/noise.jpg",
        "desc": "<b>Primary sources:</b> Depends mostly on the location. <p><b>Health effects:</b> hearing loss, sleep disturbances, high blood pressure, heart attack, strokes.</p>"
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
