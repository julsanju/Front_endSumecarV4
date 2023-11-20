import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProductsServicesService } from 'src/app/services/products-services.service';
import { Productos } from 'src/app/Interfaces/productos';
import { MatTableDataSource } from '@angular/material/table'; // Importa MatTableDataSource
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import { DataProductsService } from '../../services/data-products.service';
import { DialogOverviewComponent } from '../dialog-overview/dialog-overview.component';
declare var Grid: any;
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
  @ViewChild('gridContainer') gridContainer!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  data: Productos[] = [];
  loading: boolean = true;
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

    setTimeout(() => {
      this.loading = false;
      this.initializeGrid();
    }, 2000);

    this.servicio.obtenerProductos().subscribe(
      (response) => {
        this.dataSource.data = response;
        this.initializeGrid();
      },
      (error) => {
        console.error('Error al obtener los productos: ', error);
        this.loading = false; // Asegúrate de desactivar el loading en caso de error
      }
    );
    }

    initializeGrid() {
      const grid = new Grid({
        columns: ['codigo', 'articulo', 'laboratorio'],
        data: () => {
          return new Promise((resolve) => {
            setTimeout(() => resolve(this.getData()), 2000);
          });
        },
      });
  
      // Renderiza Grid.js en el contenedor
      grid.render(this.gridContainer.nativeElement);
    }
    getData() {
      // Convierte los datos a un formato compatible con Grid.js
      return this.data.map(item => [item.codigo, item.articulo, item.laboratorio]);
    }
    
    /*this.servicio.obtenerProductos().subscribe(
      (response) => {
        this.dataSource.data = response;
        this.dataSource = new MatTableDataSource<Productos>(response); // Inicializa con MatTableDataSource
        this.dataSource.paginator = this.paginator; // Asigna el paginador después de inicializarlo
        this.dataSource.sort = this.sort;
      },
      (error) => {
        console.error('Error al obtener los productos: ', error);
      }
    );*/

     
  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openCantidadDialog(producto: Productos): void {
    if (this.isSelected(producto)) {
      alert('Este producto ya ha sido seleccionado');
    } else {
      const dialogRef = this.dialog.open(DialogOverviewComponent, {
        width: '250px',
        data: { cantidad: producto.cantidad, item: producto}
        //data: { cantidad: this.cantidad }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          // Asigna la cantidad al producto seleccionado
          producto.cantidad = result;
          this.data.push(producto);
          // Agregar el producto al servicio
          this.dataServices.selectedData.push(producto);
        }
      });
    }
  }
  
  // Validar si el producto ya ha sido seleccionado
  isSelected(producto: Productos): boolean {
    return this.data.some(p => p.codigo === producto.codigo);
  }
  
  //evento para loading de tabla: 
  initGrid(productos: Productos[]): void {
    const grid = new Grid({
      columns: Object.keys(productos[0]), // Asumiendo que todos los productos tienen las mismas propiedades
      data: productos.map(producto => Object.values(producto)),
      sort: true,
      search: true,
    });

    grid.render(this.gridContainer.nativeElement);
  }
  
}




