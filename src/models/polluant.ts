export class Polluant {
    name: string;
    desc: string;
    image: string;

    constructor(polluant: Polluant) {
        this.name = polluant.name;    
        this.image = polluant.image;
        this.desc = polluant.desc;
    }
  
  }