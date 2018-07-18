export interface AlertDialog {
    title   : string;
    message : string;
    inputs? : AlertInput[];
    buttons?: (AlertButton)[];
}


export interface AlertInput {
  name        : string | number;
  type?       : string;
  placeholder?: string;
  value?      : string;
}
  
export interface AlertButton {
  text     : string;
  role?    : string;
  cssClass?: string;
  handler  : (value: any) => boolean|void;
}
