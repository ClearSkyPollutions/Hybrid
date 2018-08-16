import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SlidesPage } from './slides';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SlidesPage,
  ],
  imports: [
    IonicPageModule.forChild(SlidesPage),
    TranslateModule.forChild()
  ],
  exports: [
    SlidesPage
  ]
})
export class SlidesPageModule {}
