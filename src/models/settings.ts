import { AddressServer } from './addressServer.interface';

export interface Settings {
    sensors: string[];
    frequency: number;
    serverAddress: AddressServer;
    isDataShared: boolean;
}