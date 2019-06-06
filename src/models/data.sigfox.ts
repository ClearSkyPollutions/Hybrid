import { Data_SigFox2 } from "./data.sigfox.2";

export class Data_SigFox {
    
    name:string;
    data:Data_SigFox2[];
    time:string;

    constructor(name:string,data:Data_SigFox2[],time:string) {
        this.name = name;
        this.data = data;
        this.time= time;
        
    }
  }