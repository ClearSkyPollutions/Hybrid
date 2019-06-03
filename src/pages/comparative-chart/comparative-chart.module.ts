import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComparativeChartPage } from './comparative-chart';

@NgModule({
  declarations: [
    ComparativeChartPage,
  ],
  imports: [
    IonicPageModule.forChild(ComparativeChartPage),
  ],
})
export class ComparativeChartPageModule {}
