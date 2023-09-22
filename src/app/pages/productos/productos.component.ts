import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductsServicesService } from 'src/app/services/products-services.service';
import { Productos } from 'src/app/Interfaces/productos';
import { MatTableDataSource } from '@angular/material/table'; // Importa MatTableDataSource
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import { DataProductsService } from '../../services/data-products.service';
import { DialogOverviewComponent } from '../dialog-overview/dialog-overview.component';
//import { DialogData } from 'src/app/Interfaces/dialog-data';

export interface DialogData{
  cantidad : number;
}
@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
  
})
export class ProductosComponent implements OnInit {
  cantidad:number = 0
  panelOpenState = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  data: Productos[] = [];
  displayedColumns: string[] = ['codigo', 'articulo', 'laboratorio'];
  dataSource: MatTableDataSource<Productos>; // Usa MatTableDataSource

  clickedRows = new Set<Productos>();

  constructor(private servicio: ProductsServicesService, public dialog: MatDialog, private dataServices: DataProductsService) { 
    this.dataSource = new MatTableDataSource<Productos>([]);
    
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.servicio.obtenerProductos().subscribe(
      (response) => {
        this.dataSource.data = response;
        this.dataSource = new MatTableDataSource<Productos>(response); // Inicializa con MatTableDataSource
        this.dataSource.paginator = this.paginator; // Asigna el paginador después de inicializarlo
        this.dataSource.sort = this.sort;
      },
      (error) => {
        console.error('Error al obtener los productos: ', error);
      }
    );

     
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openCantidadDialog(producto: Productos): void {
    const dialogRef = this.dialog.open(DialogOverviewComponent, {
      
      width: '250px',
      
      data: { cantidad: this.cantidad }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        // Asigna la cantidad al producto seleccionado
        producto.cantidad = result; // Asigna la cantidad al producto
        this.clickedRows.add(producto);
        //agregar el producto al servicio
        this.dataServices.selectedData.push(producto);
      }
    });
  }
  
}




