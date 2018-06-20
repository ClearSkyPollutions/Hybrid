import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapsPage } from './maps';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    MapsPage,
  ],
  imports: [
    IonicPageModule.forChild(MapsPage),
    TranslateModule.forChild()
  ],
})
export class MapsPageModule {}
