import { Injectable } from '@angular/core';

import { Polluant } from '../../models/polluant';

@Injectable()
export class PolluantProvider {

  polluants: Polluant[] = [];

  constructor() {
    const polluantsInfo = [
      {
        'name': 'pm25[name]',
        'image': 'assets/imgs/polluants/pm25.jpg',
        'source': 'pm25[source]',
        'desc': 'pm25[desc]'
      },
      {
        'name': 'pm10[name]',
        'image': 'assets/imgs/polluants/pm10.jpg',
        'source': 'pm10[source]',
        'desc': 'pm10[desc]'
      },
      {
        'name': 'no2[name]',
        'image': 'assets/imgs/polluants/nox.jpg',
        'source': 'no2[source]',
        'desc': 'no2[desc]'
      },
      {
        'name': 'so2[name]',
        'image': 'assets/imgs/polluants/so2.jpg',
        'source': 'so2[source]',
        'desc': 'so2[desc]'
      },
      {
        'name': 'co[name]',
        'image': 'assets/imgs/polluants/co.jpg',
        'source': 'co[source]',
        'desc': 'co[desc]'
      },
      {
        'name': 'noise[name]',
        'image': 'assets/imgs/polluants/noise.jpg',
        'source': 'noise[source]' ,
        'desc': 'noise[desc]'
      }
    ];

    for (const p of polluantsInfo) {
      this.polluants.push(new Polluant(p));
    }
  }

  getPolluantsDescription() :Polluant[] {
    return this.polluants;
  }

}
