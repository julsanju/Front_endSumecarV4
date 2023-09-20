import { AsyncPipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ProductsServicesService } from 'src/app/services/products-services.service';
import { Productos } from 'src/app/Interfaces/productos';

import { PaginationProductsDirective, SortEvent } from '../../directives/pagination-products.directive';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [
		NgFor,
		DecimalPipe,
		FormsModule,
		AsyncPipe,
		NgbTypeaheadModule,
		NgbdSortableHeader,
		NgbPaginationModule,
		NgIf,
	],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  providers: [ProductsServicesService, DecimalPipe],
})
export class ProductosComponent implements OnInit{
  productos : Productos[] = [];
  searchTerm: string = '';
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
