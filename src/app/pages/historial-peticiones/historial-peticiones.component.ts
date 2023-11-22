import { Component, ElementRef, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { PeticioneServicesService } from 'src/app/services/peticione-services.service';
import { Peticiones } from 'src/app/Interfaces/peticiones';
import { Empleado } from 'src/app/Interfaces/empleado';
import { Observable, Subject  } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-historial-peticiones',
  templateUrl: './historial-peticiones.component.html',
  styleUrls: ['./historial-peticiones.component.css']
})
export class HistorialPeticionesComponent {
  dataUser : string = '';
  correo : string = '';
  private rolSubject = new Subject<boolean>();

  //name = 'julsanju2004@gmail.com';
  loading: boolean = true;
  data: Peticiones[] = [];
  data2: Empleado[] = [];
  displayedColumns: string[] = ['id', 'correo', 'mensaje', 'fecha', 'estado'];

  // Variables de paginación
  pageSize: number = 5;
  currentPage: number = 1;

  constructor(private servicio: PeticioneServicesService) {}

  ngOnInit() {
    setTimeout(() => {
      this.loading = false;
    }, 2000);
    
    this.validacionRol();
    console.log(this.validacionRol())
    this.rolSubject.subscribe((esEmpleado: boolean) => {
      if (esEmpleado) {

        this.handleEmpleadoCase();
      } else {
        
        this.handleClienteCase();
      }
    });
    
  }

  //metodos para poder saber si es empleado o cliente
  //empleado
  private handleEmpleadoCase() {
    this.obtenerCorreo().subscribe(
      (correo) => {
        this.correo = correo;
  
        if (this.correo) {
          this.servicio.obtenerFinalizados(this.correo).subscribe(
            (response) => {
              this.data = response;
            },
            (error) => {
              console.error('Error al obtener los productos: ', error);
              this.loading = false;
            }
          );
        }
      },
      (error) => {
        console.error('Error al obtener el correo: ', error);
        this.loading = false;
      }
    );
  }
  //cliente
  private handleClienteCase() {
    this.obtener_usuarioToClientes().subscribe(
      (usuario) => {
        this.dataUser = usuario;
  
        if (this.dataUser) {
          this.servicio.obtenerFinalizadosCliente(this.dataUser).subscribe(
            (response) => {
              this.data = response;
            },
            (error) => {
              console.error('Error al obtener los productos: ', error);
              this.loading = false;
            }
          );
        }
      }
    );
  }

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

  //metodo para validar el rol del usuario
  validacionRol(): void {
    var name = this.obtener_usuario(this.dataUser);
  
    this.servicio.obtenerCorreo(name).subscribe(
      (response) => {
        this.data2 = response;
        const esEmpleado = this.data2[0].rol === 'empleado';
        this.rolSubject.next(esEmpleado);
      },
      (error) => {
        // Manejar errores si es necesario
        console.error(error);
        this.rolSubject.next(false); // En caso de error, asumimos que no es empleado
      }
    );
  }

  
  private obtener_usuarioToClientes(): Observable<string> {
    return new Observable((observer) => {
      const userDataString = localStorage.getItem('userData');
      if (userDataString) {
        try {
          const userData = JSON.parse(userDataString);
          const username = userData.usuario;
          observer.next(username);
          observer.complete();
        } catch (error) {
          observer.error('Error al analizar JSON:');
        }
      } else {
        observer.error('No se encontró userData en localStorage.');
      }
    });
  }


  obtenerCorreo(): Observable<string>{
    var name = this.obtener_usuario(this.dataUser);

    return this.servicio.obtenerCorreo(name).pipe(
      map((response) => {
        this.data2 = response;
        return this.data2[0].correo;
      })
    );
      
  }

  getPaginatedData(): Peticiones[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.data.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.data.length);
  }
}
