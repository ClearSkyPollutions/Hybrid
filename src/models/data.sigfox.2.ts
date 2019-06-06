import { Data } from "./data.interface";

export class Data_SigFox2 {
    
    name:string;
    data:Data[];
    time:string;

    constructor(name:string,data:Data[],time:string) {
        this.name = name;
        this.data = data;
        this.time= time;
        
    }
  }