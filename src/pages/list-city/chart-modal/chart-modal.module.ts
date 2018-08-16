import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChartModalPage } from './chart-modal';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ChartModalPage,
  ],
  imports: [
    IonicPageModule.forChild(ChartModalPage),
    TranslateModule.forChild()
  ],
  exports: [
    ChartModalPage
  ]
})
export class ChartModalPageModule {}
