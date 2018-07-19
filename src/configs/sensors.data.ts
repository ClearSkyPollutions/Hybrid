import { Sensor } from '../models/sensor.interface';

export const SENSORS : Sensor[] = [
    {
        name      : 'PMS5003',
        desc      : '',
        image     : 'assets/imgs/sensors/pms5003.png',
        pollutants: 'PM10, PM2.5',
        help      : 'www.google.com'
    },
    {
        name      : 'MQ-2',
        desc      : 'Standard gas concentration sensor, conductivity of the sensor depends on the concentration of target gases in the air.',
        image     : 'assets/imgs/sensors/mq2.bmp',
        pollutants: 'Combustible Gases - Methane, Butane, LPG, smoke',
        help      : ''
    },
    {
        name      : 'DHT22',
        desc      : 'Uses a capacitive humidity sensor and a thermistor to measure the surrounding air. Readings every 2 seconds.',
        image     : 'assets/imgs/sensors/dht22.jpg',
        pollutants: 'Temperature, Humidity',
        help      : ''
    },
    {
        name      : 'MISC',
        desc      : '',
        image     : 'assets/imgs/sensors/misc.png',
        pollutants: '',
        help      : ''
    },
    {
        name      : 'Microphone',
        desc      : '',
        image     : 'assets/imgs/sensors/microphone.jpg',
        pollutants: '',
        help      : ''
    }
];


