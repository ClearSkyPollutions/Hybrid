import { AddressServer } from './addressServer.interface';

export interface Settings {
    sensors: string[];
    frequency: number;
    //ssid: string;
    //password: string;
    //securityType: string;
    raspberryPiAddress: AddressServer;
    serverAddress: AddressServer;
    isDataShared: boolean;
}
