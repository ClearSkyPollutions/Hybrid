export interface AlertDialog {
    title: string;
    message: string;
    input? : AlertInput;
    input_1?: AlertInput;
    input_2?: AlertInput;
    button?: AlertButton;
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
