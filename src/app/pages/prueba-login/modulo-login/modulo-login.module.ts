import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    RouterModule, 
    HttpClientModule, 
    MatPaginatorModule, 
    MatTableModule, 
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
    MatCardModule, 
    RouterOutlet
  ]
})
export class ModuloLoginModule { }
