export interface DataMapFactorized {
    date     : string;
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
    date     : string;
    value    : string;
    pollutant: string;
    unit     : string;
    sensor   : string;
    system   : string;
    latitude : number;
    longitude: number;
}

export interface DataMapConstValues {
    date     : string;
    system   : string;
    latitude : number;
    longitude: number;
}