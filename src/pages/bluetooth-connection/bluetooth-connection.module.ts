import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BluetoothConnectionPage } from './bluetooth-connection';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    BluetoothConnectionPage,
  ],
  imports: [
    IonicPageModule.forChild(BluetoothConnectionPage),
    TranslateModule.forChild()
  ],
  exports: [
    BluetoothConnectionPage
  ]
})
export class BluetoothConnectionPageModule {}
