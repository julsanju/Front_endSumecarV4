import { Component, OnInit } from '@angular/core';
import { Empleado } from 'src/app/Interfaces/empleado';
import { UsuariosView } from 'src/app/Interfaces/usuarios-view';
import { UsuariosServicesService } from 'src/app/services/usuarios-services.service';

@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  imports: [],
  templateUrl: './crear-usuario.component.html',
  styleUrl: './crear-usuario.component.css'
})
export class CrearUsuarioComponent implements OnInit{
  dataSource : Empleado [] = [];
  originalDataSource: Empleado[] = [];
  currentPage: number = 1;
  pageSize: number = 8;
  constructor(private servicioUsuarios : UsuariosServicesService){}

  ngOnInit(): void {
    // Llamada al servicio para obtener los datos

    this.servicioUsuarios.obtenerEmpleado().subscribe(
      (response) => {
        this.dataSource = response;
        this.originalDataSource = response;
      },
      error => {
        console.error('Error obteniendo datos', error);
      }
    );


  }

  getPaginatedData(): Empleado[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.dataSource.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.dataSource.length);
  }
}
