import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumbersOnlyDirective } from 'src/app/directives/numbers-only.directive';



@NgModule({
  declarations: [NumbersOnlyDirective],
  imports: [
    CommonModule
  ],
  exports: [NumbersOnlyDirective]
})
export class ModuloSharedModule { }
