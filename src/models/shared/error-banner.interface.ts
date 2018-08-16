export const enum ERROR_TYPES {
    DANGER  = 'danger',
    WARNING = 'warning',
  }

export interface ErrorDetails {
    class  : string;
    status : number;
    event  : any;
    name   : string;
    message: string;
    type   : ERROR_TYPES;
}