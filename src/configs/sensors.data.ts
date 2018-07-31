import { Sensor } from '../models/sensor.interface';

export const SENSORS : Sensor[] = [
    {
        name      : 'PMS5003',
        desc      : 'pms5003[desc]',
        image     : 'assets/imgs/sensors/pms5003.png',
        pollutants: 'pms5003[pollutants]',
        help      : 'www.google.com'
    },
    {
        name      : 'MQ2',
        desc      : 'mq2[desc]',
        image     : 'assets/imgs/sensors/mq2.png',
        pollutants: 'mq2[pollutants]',
        help      : ''
    },
    {
        name      : 'DHT22',
        desc      : 'dht22[desc]',
        image     : 'assets/imgs/sensors/dht22.jpg',
        pollutants: 'dht22[pollutants]',
        help      : ''
    },
    {
        name      : 'MISC',
        desc      : 'misc[desc]',
        image     : 'assets/imgs/sensors/misc.png',
        pollutants: 'misc[pollutants]',
        help      : ''
    },
    {
        name      : 'Microphone',
        desc      : 'microphone[desc]',
        image     : 'assets/imgs/sensors/microphone.jpg',
        pollutants: 'microphone[pollutants]',
        help      : ''
    }
];


