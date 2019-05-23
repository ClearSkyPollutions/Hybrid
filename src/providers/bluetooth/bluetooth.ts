import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AlertController, ToastController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

@Injectable()
export class BluetoothProvider { pairedList: pairedlist;
  listToggle: boolean = false;
  pairedDeviceID: number = 0;
  dataSend: string = "";
  longitude:number = 0;
  latitude:number = 0;
  connected: boolean= false;
  
  constructor(private alertCtrl: AlertController,private bluetoothSerial: BluetoothSerial,
     private toastCtrl: ToastController) {
  
     }

  


  listPairedDevices() {
    this.bluetoothSerial.list().then(success => {
      this.pairedList = success;
      console.log('success: ', success);
      this.listToggle = true;
    }, error => {
      this.showError("Please Enable Bluetooth")
      this.listToggle = false;
    });
  }

  selectDevice() {
    let connectedDevice = this.pairedList[this.pairedDeviceID];
    if (!connectedDevice.address) {
      this.showError('Select Paired Device to connect');
      return;
    }
    let address = connectedDevice.address;
    let name = connectedDevice.name;

    this.connect(address);
  }

  connect(address) {
    // Attempt to connect device with specified address, call app.deviceConnected if success
    this.bluetoothSerial.connect(address).subscribe(success => {
      this.deviceConnected();
      this.connected=true;
      this.showToast("Successfully Connected");
      
    }, error => {
      this.showError("Error:Connecting to Device");
      this.connected=false;
    });
  }

  deviceConnected() {
    // Subscribe to data receiving as soon as the delimiter is read
    this.bluetoothSerial.subscribe('\n').subscribe(success => {
      this.handleData(success);
      this.connected=true;
    }, error => {
      this.showError(error);
      this.connected=false;
    });
  }

  deviceDisconnected() {
    // Unsubscribe from data receiving
    this.bluetoothSerial.disconnect();
    this.showToast("Device Disconnected");
    this.connected=false;
  }

  handleData(data) {
    this.showToast(data);
  }

  sendData(message) {
    message+='\n';
    this.showToast(message);

    this.bluetoothSerial.write(message).then(success => {
      this.showToast(success);
    }, error => {
      this.showError(error)
    });
  }

  showError(error) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: error,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  showToast(msj) {
    const toast = this.toastCtrl.create({
      message: msj,
      duration: 1000
    });
    toast.present();

  }



}

interface pairedlist {
  "class": number,
  "id": string,
  "address": string,
  "name": string
}