import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerWOverayComponent } from './progress-spinner-w-overay.component';
import { OverlayService, AppOverlayConfig } from './overlay.service';

@NgModule({
  imports: [
    CommonModule    
  ],
  declarations: [
    ProgressSpinnerWOverayComponent
  ],
  providers: [OverlayService],
  exports: [
    ProgressSpinnerWOverayComponent
  ]
})
export class ProgressSpinnerModule { }