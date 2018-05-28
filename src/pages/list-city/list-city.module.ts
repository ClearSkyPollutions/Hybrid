import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListCityPage } from './list-city';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ListCityPage,
  ],
  imports: [
    IonicPageModule.forChild(ListCityPage),
    TranslateModule.forChild()
  ],
  exports: [
    ListCityPage
  ]
})
export class ListCityPageModule {}