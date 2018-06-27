export interface DataMapFactorized {
    date     : Date;
    values   : DataMapValues[];
    system   : string;
    latitude : number;
    longitude: number;
}

export interface DataMapValues {
    sensor   : string;
    pollutant: string;
    value    : string;
    unit     : string;
}

export interface DataMap  {
    date     : Date;
    value    : string;
    pollutant: string;
    unit     : string;
    sensor   : string;
    system   : string;
    latitude : number;
    longitude: number;
}

export interface DataMapConstValues {
    date     : Date;
    system   : string;
    latitude : number;
    longitude: number;
}