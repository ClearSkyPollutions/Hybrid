import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { PLATFORM_WORKER_APP_ID } from '@angular/common/src/platform_id';
import { ChartOptions } from '../../models/chartInfo.interface';
import { Data } from '../../models/data.interface';
import { Data_Sigfox } from '../../models/data.sigfox';



@Component({
  selector: 'page-sigfox-data',
  templateUrl: 'sigfox-data.html'
})
export class SigFoxDataPage implements OnInit{

  posts : Data_Sigfox[] = null;
  PMS1_0 : Number[] = [];
  PMS2_5 : Number[] = [];
  gazPPM : Number[] = [];
  temperature : Number[] = [];
  humidity : Number[] = [];
  micAnalog : Number[] = [];
  Pressure : Number[] = [];
  altitude : Number[] = [];
  lvlBattery : Number[] = [];
  PMS1_MAX:any;
  PMS1_MIN:Number;
  PMS1_Range: any;
  PMS2_Range: any;
  gazPPM_Range: any;
  Temperature_Range: any;
  Humidity_Range: any;
  Micro_Range: any;
  Pressure_Range: any;
  Altitude_Range: any;
  lvlBattery_Range: any;
  
  

   

  constructor(public navCtrl: NavController ,private modalCtrl: ModalController, public http:HttpClient,public navParams: NavParams) {

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization':"Basic " + btoa("5ccc0aa00499f50883e9869f:6bd7114e7ebd0861ca1e857aadfb7a15")
      })
    };
    
   
    this.http
    .get('https://cors-anywhere.herokuapp.com/https://backend.sigfox.com/api/devices/1D91CA/messages',httpOptions)
    .subscribe(data  => {
    //console.log('data: ', data.data["time"]);
    this.posts = data.data;

    this.posts = this.posts.map((element:any) => {
     // console.log('element1: ', element);
     // console.log('element["data"]: ', element["data"]);

     var t = new Date( element["time"] * 1000);
     let formatted =  t.getUTCDate() + 'j';
     //console.log('date: ', formatted);

     element = new Data_Sigfox(this.hex_to_dec(element["data"]),element["time"]);
     
    
     



        //console.log('element: ', element);
        return element;
       

      

    });
    /*this.posts = this.posts.map(number => {
      console.log("number1 : " + number);
       for (let index = 0; index < number.length; index++) {
        switch (index) {
          case 0: return this.convert(number,0,300);
            
            break;
          case 1: return this.convert(number,0,300); 
            
            break;
          case 2: return this.convert(number,1,1000); 
            
            break;
          case 3: return this.convert(number,-40,80);
            
            break;
          case 4:return this.convert(number,0,100);
            
            break;
          case 5: return this.convert(number,0,3.3);
            
            break;
          case 6: return this.convert(number,300,1100);
            
            break;
          case 7: return this.convert(number,300,1100);
            
            break;
          case 8: return this.convert(number,0,100);
            
            break;
        
          default:
            break;
        }
         
         
       }
       //return this.convert(number);
      
      // number = this.convert(number);
       //console.log("number2 : " + number);
       
       
       
      
    });*/
    
     //console.log(' this.posts: ',  this.posts);
     //console.log('data ', this.HexToBin("F"));
     this.SortData();
     this.PMS1_0 = this.convert(this.PMS1_0,this.PMS1_Range.lower,this.PMS1_Range.upper);
     //console.log('this.PMS1_02: ', this.PMS1_0);
     this.PMS2_5 = this.convert(this.PMS2_5,this.PMS2_Range.lower,this.PMS2_Range.upper);
     this.gazPPM = this.convert(this.gazPPM,this.gazPPM_Range.lower,this.gazPPM_Range.upper);
     this.temperature =  this.convert(this.temperature,this.Temperature_Range.lower,this.Temperature_Range.upper);
     this.humidity = this.convert(this.humidity,this.Humidity_Range.lower,this.Humidity_Range.upper);
     this.micAnalog = this.convert(this.micAnalog,this.Micro_Range.lower,this.Micro_Range.upper);
     this.Pressure = this.convert(this.Pressure,this.Pressure_Range.lower,this.Pressure_Range.upper);
     this.altitude = this.convert(this.altitude,this.Altitude_Range.lower,this.Altitude_Range.upper);
     this.lvlBattery = this.convert(this.lvlBattery,this.lvlBattery_Range.lower,this.lvlBattery_Range.upper);
  },
  err => {
    console.log("Oops!");
    
}
);



  }

   hex_to_ascii(str1)
{
    var hex  = str1.toString();

    var str = '';
    for (var n = 0; n < hex.length; n += 2) {
        str += parseInt(hex,16).toString(2);
    }
    
    return str;

}

SortData(){
 //console.log("postatb" + this.posts);
  this.posts.forEach(element => {

    for (let index = 0; index < element.data.length; index++) {
      switch (index) {
        case 0: this.PMS1_0.push(element.data[index]); 
          
          break;
        case 1: this.PMS2_5.push(element.data[index]); 
          
          break;
        case 2: this.gazPPM.push(element.data[index]); 
          
          break;
        case 3: this.temperature.push(element.data[index]); 
          
          break;
        case 4: this.humidity.push(element.data[index]); 
          
          break;
        case 5: this.micAnalog.push(element.data[index]); 
          
          break;
        case 6: this.Pressure.push(element.data[index]); 
          
          break;
        case 7: this.altitude.push(element.data[index]); 
          
          break;
        case 8: this.lvlBattery.push(element.data[index]); 
          
          break;
      
        default:
          break;
      }
      
      
    }
    
  });
  console.log('this.PMS1_01: ', this.PMS1_0.values);
  //console.log("PMS1tab " + this.PMS1_0);
  //console.log("temperature " + this.temperature);
}

convert(Ve,min,max){
  var vmax = max;
  var vmin = min ;


var vr:Number[]= [] ;

for (var i = 0; i < Ve.length; i += 1) {
  let num = Ve[i]*(vmax - (vmin));
  let deno = Math.pow(2,8);
 // console.log('deno: ', deno);
  let quot = num/deno;
  let elem = quot + (vmin);
  vr.push(elem);

}
return vr;
}

hex_to_dec(str1)
{
  var tab :Number[] = [];
    var hex  = str1;
    
   var str = 0;
    for (var i = 0; i < hex.length; i += 2) {
     
        let hex2 = hex[i]+hex[i+1];
       // console.log('hex2: ', hex2);
        
        str = parseInt(hex2,16);
        tab.push(str);
    
  }

  


 // console.log('TAB: ', tab);
    return tab;
    

}



  ngOnInit() {
    this.PMS1_Range = this.navParams.get('knobValuesPMS1_0');
    this.PMS2_Range = this.navParams.get('knobValuesPMS2_5');
    this.gazPPM_Range= this.navParams.get('knobValuesGAZPPM');
    this.Temperature_Range = this.navParams.get('knobValuesTemperature');
    this.Humidity_Range = this.navParams.get('knobValuesHumidity');
    this.Micro_Range = this.navParams.get('knobValuesMicro');
    this.Pressure_Range = this.navParams.get('knobValuesPressure');
    this.Altitude_Range = this.navParams.get('knobValuesAlti');
    this.lvlBattery_Range = this.navParams.get('knobValuesBattery');
    //console.log(this.PMS1_Range.lower);
    //console.log(this.PMS1_Range.upper);


  }

  openChartModal(pollutant: string, unit: string, color: string,tabPMS1:any,post) :void {
    const chartOptions : ChartOptions = {
      pollutant: pollutant,
      unit: unit,
      color: color
    };
    this.modalCtrl.create('ChartModalPage', { chartOptions: chartOptions, PMS1_0:tabPMS1,Post:post }, {
      cssClass: 'inset-modal',
      
    } )
      .present();
      console.log("poulet braisé");


  }


  
 
  
}

