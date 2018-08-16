import { AddressServer } from './addressServer.interface';

export interface StoredConf {
    frequency   : number;
    sensors     : string[];
    rasp_ip     : AddressServer ;
    server_ip?  : AddressServer;
    isDataShared: boolean;
}
