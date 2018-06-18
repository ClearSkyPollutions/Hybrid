import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ParametersPage } from './parameters';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ParametersPage,
  ],
  imports: [
    IonicPageModule.forChild(ParametersPage),
    TranslateModule.forChild()
  ],
  exports: [
    ParametersPage
  ]
})
export class ParametersPageModule {}
