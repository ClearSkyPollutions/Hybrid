import { HttpAddress } from './httpAddress.interface';

export interface Settings {
    frequency: number;
    //ssid: string;
    //password: string;
    //securityType: string;
    sensors: string[];
    raspi: HttpAddress;
    server: HttpAddress;
    isDataShared: boolean;
}