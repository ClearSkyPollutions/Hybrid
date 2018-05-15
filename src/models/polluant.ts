export class Polluant {
    name: string;
    desc: string;
    source: string;
    image: string;

    constructor(polluant: Polluant) {
        this.name = polluant.name;    
        this.image = polluant.image;
        this.source = polluant.source;
        this.desc = polluant.desc;
    }
  
  }