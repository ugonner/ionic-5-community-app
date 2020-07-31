import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SectionPage } from './section';

@NgModule({
  declarations: [
    SectionPage,
  ],
  imports: [
    IonicPageModule.forChild(SectionPage),
  ],
})
export class SectionPageModule {}
