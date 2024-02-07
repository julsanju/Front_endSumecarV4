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
  

  ngOnInit(){
    
  }

  
  
}
