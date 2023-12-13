import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductosComponent } from '../productos.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { RouterOutlet } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';



@NgModule({
  declarations: [ProductosComponent],
  imports: [CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatPaginatorModule, MatTableModule,
    MatProgressBarModule,
    MatStepperModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSortModule,
    MatInputModule,
    MatExpansionModule,
    MatDialogModule,
    MatGridListModule,
    MatCardModule,NzInputModule,RouterOutlet
  ],
  exports : [ProductosComponent]
})
export class ModuloProductosModule { }
