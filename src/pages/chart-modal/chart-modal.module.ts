import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChartModalPage } from './chart-modal';

@NgModule({
  declarations: [
    ChartModalPage,
  ],
  imports: [
    IonicPageModule.forChild(ChartModalPage),
  ],
  exports: [
    ChartModalPage
  ]
})
export class ChartModalPageModule {}
