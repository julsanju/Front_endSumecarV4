import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuariosServicesService } from 'src/app/services/usuarios-services.service';
import { UsuariosView } from 'src/app/Interfaces/usuarios-view';
import { MatTableDataSource } from '@angular/material/table'; // Importa MatTableDataSource
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import { DataProductsService } from '../../services/data-products.service';
import { DialogOverviewComponent } from '../dialog-overview/dialog-overview.component';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
  cantidad:number = 0
  panelOpenState = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  data: UsuariosView[] = [];
  displayedColumns: string[] = ['Identificacion', 'Nombre', 'Telefono', 'Correo', 'Rol'];
  dataSource: MatTableDataSource<UsuariosView>; // Usa MatTableDataSource

  clickedRows = new Set<UsuariosView>();

  constructor(private servicio: UsuariosServicesService, public dialog: MatDialog, private dataServices: DataProductsService) { 
    this.dataSource = new MatTableDataSource<UsuariosView>([]);
    
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.servicio.obtenerUsuarios().subscribe(
      (response) => {
        this.dataSource.data = response;
        this.dataSource = new MatTableDataSource<UsuariosView>(response); // Inicializa con MatTableDataSource
        this.dataSource.paginator = this.paginator; // Asigna el paginador después de inicializarlo
        this.dataSource.sort = this.sort;
        console.log(response)
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
