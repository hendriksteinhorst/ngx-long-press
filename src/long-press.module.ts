import { NgModule } from '@angular/core';
import { LongPressDirective } from './long-press.directive';
import { LongTouchDirective } from './long-touch.directive';

@NgModule({
  declarations: [ LongPressDirective, LongTouchDirective ],
  exports: [ LongPressDirective, LongTouchDirective ]
})
export class LongPressModule {}