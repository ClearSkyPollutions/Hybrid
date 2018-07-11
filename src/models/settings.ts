import { AddressServer } from './addressServer.interface';

export interface Settings {
    sensors: string[];
    frequency: number;
    //ssid: string;
    //password: string;
    //securityType: string;
    serverAddress: AddressServer;
    isDataShared: boolean;
}
