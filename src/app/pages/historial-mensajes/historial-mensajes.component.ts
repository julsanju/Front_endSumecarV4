import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductsServicesService } from 'src/app/services/products-services.service';
import { Productos } from 'src/app/Interfaces/productos';
import { MatTableDataSource } from '@angular/material/table'; // Importa MatTableDataSource
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import { DataProductsService } from '../../services/data-products.service';
import { DialogOverviewComponent } from '../dialog-overview/dialog-overview.component';

@Component({
  selector: 'app-historial-mensajes',
  templateUrl: './historial-mensajes.component.html',
  styleUrls: ['./historial-mensajes.component.css']
})
export class HistorialMensajesComponent implements OnInit {
  dataUser : string = '';
  cantidad:number = 0
  panelOpenState = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  data: Productos[] = [];
  displayedColumns: string[] = ['# Orden','codigo', 'articulo', 'laboratorio'];
  dataSource: MatTableDataSource<Productos>; // Usa MatTableDataSource

  clickedRows = new Set<Productos>();

  constructor(private servicio: ProductsServicesService, public dialog: MatDialog, private dataServices: DataProductsService) { 
    this.dataSource = new MatTableDataSource<Productos>([]);
    
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  //metodo para poder obtener el dato del usuario
  private obtener_usuario(username : string){
    //obtener username
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      try {
        // Intenta analizar la cadena como JSON
        const userData = JSON.parse(userDataString);
        username = userData.usuario; // Actualiza la propiedad 'username' con el valor correcto
      } catch (error) {
        // En caso de un error al analizar JSON, puedes manejarlo o simplemente retornar false
        console.error('Error al analizar JSON:', error);
      }
    }
    return username;
  }

  ngOnInit() {
     var data = this.obtener_usuario(this.dataUser);

    this.servicio.obtenerFinalizado(data).subscribe(
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

  
}
