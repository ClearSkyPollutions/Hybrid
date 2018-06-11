import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewChartModalPage } from './new-chart-modal';

@NgModule({
  declarations: [
    NewChartModalPage,
  ],
  imports: [
    IonicPageModule.forChild(NewChartModalPage),
  ],
  exports: [
    NewChartModalPage
  ]
})
export class NewChartModalPageModule { }
