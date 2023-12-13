import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Productos } from 'src/app/Interfaces/productos';

import {MatButtonModule} from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';
import {MatInputModule} from '@angular/material/input';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-overview',
  standalone: true,
  imports: [
            CommonModule, 
            FormsModule, 
            ReactiveFormsModule, 
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
            RouterOutlet],
  templateUrl: './dialog-overview.component.html',
  styleUrls: ['./dialog-overview.component.css']
})
export class DialogOverviewComponent {
  cantidad: number = 0;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onConfirm(): void {
    // Validar que la cantidad sea un número mayor a 0
    const cantidad = parseFloat(this.data.cantidad);

    if (isNaN(cantidad) || cantidad <= 0) {
      alert('Por favor, ingrese un número válido y mayor a 0.');
      return; // Salir de la función si la validación falla
    }

    // Si la validación es exitosa, puedes cerrar el diálogo y pasar la nueva cantidad de regreso
    this.dialogRef.close(cantidad);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  validationCantidad(item: Productos): void {
    // Verificar si la cantidad es un número válido
    const nuevaCantidad = (item.cantidad);
    
    if (isNaN(nuevaCantidad) || nuevaCantidad < 0) {
      // Si la cantidad no es un número válido o es negativa, muestra una alerta y restaura el valor anterior
      alert('Por favor ingrese un numero valido para la cantidad');
      item.cantidad = item.cantidad; // Restaura el valor anterior
    } else {
      // Realiza cualquier acción adicional necesaria aquí, por ejemplo, guardar los cambios en el servidor
      // En este ejemplo, simplemente actualizamos la cantidad en el objeto Productos
      item.cantidad = nuevaCantidad;
    }
  }
}


