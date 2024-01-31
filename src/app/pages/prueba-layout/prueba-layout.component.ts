import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-prueba-layout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prueba-layout.component.html',
  styleUrl: './prueba-layout.component.css'
})
export class PruebaLayoutComponent {
  data = [
    { numero_orden: 1, nombre: 'Nombre 1', apellido: 'Apellido 1', ciudad: 'Ciudad 1', identificacion: 'ID 1', showDetails: false },
    { numero_orden: 2, nombre: 'Nombre 2', apellido: 'Apellido 2', ciudad: 'Ciudad 2', identificacion: 'ID 2', showDetails: false },
    // Agrega más datos según sea necesario
  ];

  toggleAccordion(row: any): void {
    row.showDetails = !row.showDetails;
  }
}
