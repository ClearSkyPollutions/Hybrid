import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { BluetoothProvider } from '../../providers/bluetooth/bluetooth'
import { Injectable } from "@angular/core";


@IonicPage()
@Component({
  selector: 'page-bluetooth-connection',
  templateUrl: 'bluetooth-connection.html',
})
export class BluetoothConnectionPage {
  dataSend: string;



  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private bluetoothProvider: BluetoothProvider  ){  }

  listPairedDevices(){
    console.log("je suis la ")
     this.bluetoothProvider.listPairedDevices()
    
  }
  selectDevice(){
        this.bluetoothProvider.selectDevice();
  }
  sendData(){

    this.bluetoothProvider.sendData(this.dataSend);
  }
  deviceDisconnected(){
    this.bluetoothProvider.deviceDisconnected()
  }

}

interface pairedlist {
  "class": number,
  "id": string,
  "address": string,
  "name": string
}
