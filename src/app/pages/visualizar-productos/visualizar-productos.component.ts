import { Component } from '@angular/core';
import { DataProductsService } from 'src/app/services/data-products.service';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { Productos } from 'src/app/Interfaces/productos';

@Component({
  selector: 'app-visualizar-productos',
  templateUrl: './visualizar-productos.component.html',
  styleUrls: ['./visualizar-productos.component.css']
})
export class VisualizarProductosComponent {
  constructor(public data: DataProductsService) { }

  displayedColumns: string[] = ['codigo', 'articulo', 'laboratorio', 'cantidad'];
  
}
