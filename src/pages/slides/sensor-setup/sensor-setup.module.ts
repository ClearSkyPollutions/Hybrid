import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SensorSetupPage } from './sensor-setup';

@NgModule({
  declarations: [
    SensorSetupPage,
  ],
  imports: [
    IonicPageModule.forChild(SensorSetupPage),
  ],
  exports: [
    SensorSetupPage
  ]
})
export class SensorSetupPageModule {}
