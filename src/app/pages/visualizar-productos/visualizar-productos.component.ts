import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DataProductsService } from 'src/app/services/data-products.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Productos } from 'src/app/Interfaces/productos';
import { ProductsServicesService } from 'src/app/services/products-services.service';
@Component({
  selector: 'app-visualizar-productos',
  templateUrl: './visualizar-productos.component.html',
  styleUrls: ['./visualizar-productos.component.css']
})
export class VisualizarProductosComponent implements OnInit{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public data: DataProductsService) { }

  displayedColumns: string[] = ['codigo', 'articulo', 'laboratorio', 'cantidad'];

  dataSource = new MatTableDataSource<Productos>([]); // Inicializa con un arreglo vacío

  ngOnInit() {
    // No configures el dataSource aquí, solo inicializa con un arreglo vacío
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Después de configurar el paginador y el ordenamiento, puedes actualizar los datos
    this.dataSource.data = this.data.selectedData;
  }

  
}
