import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DetallePeticionP } from 'src/app/Interfaces/detalle-peticionP';

@Component({
  selector: 'app-prueba-layout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prueba-layout.component.html',
  styleUrl: './prueba-layout.component.css'
})
export class PruebaLayoutComponent implements OnInit{
  detalle : DetallePeticionP [] = [{ Articulo: '', Cantidad: 0 }];

  ngOnInit(){
    
  }

  addRow(index: number) {
    if (index === this.detalle.length - 1) {
      this.detalle.push({ Articulo: '', Cantidad: 0 });

      setTimeout(() => {
        const newIndex = index + 1;
        const newElement = document.getElementById('articulo_' + newIndex);
        if (newElement) {
          newElement.focus();
        }
      });
    }
  }
  
}
