import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListPolluantPage } from './list-polluant';

@NgModule({
  declarations: [
    ListPolluantPage,
  ],
  imports: [
    IonicPageModule.forChild(ListPolluantPage),
  ],
  exports:[
    ListPolluantPage
  ]
})
export class ListPolluantPageModule {}
