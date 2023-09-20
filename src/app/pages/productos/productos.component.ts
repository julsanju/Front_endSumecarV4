
import { Component, OnInit} from '@angular/core';
import { ProductsServicesService } from 'src/app/services/products-services.service';
import { Productos } from 'src/app/Interfaces/productos';
import {NgIf, NgFor} from '@angular/common';
import {MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  standalone: true,
  imports: [MatTableModule, NgIf, NgFor]
})
export class ProductosComponent implements OnInit{
  productos : Productos[] = [];
  displayedColumns: string[] = ['codigo', 'articulo', 'laboratorio'];
  dataSource = this.productos;
  clickedRows = new Set<Productos>();
  // Aquí debes tener una lista de productos, por ejemplo:
  
  constructor(private servicio: ProductsServicesService){ }

  ngOnInit(){
   this.servicio.obtenerProductos().subscribe(
    (response) =>{
      this.productos = response;
    },
    (error) => {
      console.error('Error al obtener los productos: ', error)
    } 
   );   
  }
  
  
}
