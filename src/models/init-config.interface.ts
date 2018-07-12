import { AddressServer } from './addressServer.interface';

export interface InitConfig {
    sensors     : string[];
    rasp_ip     : AddressServer ;
    server_ip?  : AddressServer;
    isDataShared: boolean;
}
