import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddChartPage } from './add-chart';

@NgModule({
  declarations: [
    AddChartPage,
  ],
  imports: [
    IonicPageModule.forChild(AddChartPage),
  ],
  exports: [
    AddChartPage
  ]
})
export class AddChartPageModule { }
