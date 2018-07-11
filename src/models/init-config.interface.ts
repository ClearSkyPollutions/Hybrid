import { AddressServer } from './addressServer.interface';

export interface InitConfig {
    sensors: Capteur[] ;
    rasp_ip: AddressServer;
    server_ip?: AddressServer;
    isDataShared: boolean;
}

export interface Capteur {
    name: string;
    isUsed: boolean;
}