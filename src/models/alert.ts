export interface Alert {
    title: string;
    message: string;
    input? : AlertInput;
    button_1?: AlertButton;
    button_2?: AlertButton;
 }
 
 export interface AlertInput {
   name: string | number;
   type?: string;
   placeholder?: string;
   value?: string;
 }
 export interface AlertButton {
   text: string;
   role?: string;
   cssClass?: string;
   handler: (value: any) => boolean|void;
 }
 