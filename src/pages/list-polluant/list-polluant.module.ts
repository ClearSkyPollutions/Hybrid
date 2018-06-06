import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListPolluantPage } from './list-polluant';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ListPolluantPage,
  ],
  imports: [
    IonicPageModule.forChild(ListPolluantPage),
    TranslateModule.forChild()
  ],
  exports:[
    ListPolluantPage
  ]
})
export class ListPolluantPageModule {}
