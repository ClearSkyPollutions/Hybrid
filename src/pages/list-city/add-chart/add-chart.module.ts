import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddChartPage } from './add-chart';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    AddChartPage,
  ],
  imports: [
    IonicPageModule.forChild(AddChartPage),
    TranslateModule.forChild()
  ],
  exports: [
    AddChartPage
  ]
})
export class AddChartPageModule { }