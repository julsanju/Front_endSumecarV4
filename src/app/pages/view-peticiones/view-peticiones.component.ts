import { Component, ElementRef, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { PeticioneServicesService } from 'src/app/services/peticione-services.service';
import { Peticiones } from 'src/app/Interfaces/peticiones';
import { Empleado } from 'src/app/Interfaces/empleado';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { MensajeError } from 'src/app/Interfaces/mensaje-error';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-peticiones',
  templateUrl: './view-peticiones.component.html',
  styleUrls: ['./view-peticiones.component.css'],
})
export class ViewPeticionesComponent implements OnInit {
  dataUser : string = '';
  correo : string = '';
  errorMessage: MensajeError | null = null;
  spinner: boolean = false;
  loading: boolean = true;
  data: Peticiones[] = [];
  data2: Empleado[] = [];
  displayedColumns: string[] = ['id', 'correo', 'mensaje', 'fecha', 'estado'];

  // Variables de paginación
  pageSize: number = 5;
  currentPage: number = 1;

  constructor(private servicio: PeticioneServicesService, private router:Router) {}

  ngOnInit() {
    setTimeout(() => {
      this.loading = false;
    }, 2000);
  
    // Llamamos a obtenerCorreo y nos suscribimos al observable resultante
    this.obtenerCorreo().subscribe(
      (correo) => {
        // Cuando se obtenga el correo, lo asignamos a this.correo y llamamos a obtenerPendientes
        this.correo = correo;
  
        // Verificamos si la variable correo se ha asignado antes de llamar a obtenerPendientes
        if (this.correo) {
          this.servicio.obtenerPendientes(this.correo).subscribe(
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

  obtenerCorreo(): Observable<string>{
    var name = this.obtener_usuario(this.dataUser);

    return this.servicio.obtenerCorreo(name).pipe(
      map((response) => {
        this.data2 = response;
        return this.data2[0].correo;
      })
    );
      
  }

  finalizarPeticion(id: number): void {
    this.servicio.FinalizarPeticion(id).subscribe(
      () => {
        this.spinner = true;
        this.spinner = false;

        Swal.fire('La peticion ha sido finalizada correctamente!', '', 'success');

        this.errorMessage = null; // Limpiar el mensaje de error si hubo éxito
        console.log('Login exitoso');
        this.router.navigate(['/menu/historial-peticiones']);
      },
      (error) => {
        this.spinner = false;

        this.errorMessage = error.Message; // Accede al campo "Message" del JSON de error
        

        Swal.fire({
          title: 'ERROR',
          html: `${this.errorMessage}`,
          icon: 'error',
        });
      }
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

  /*cantidad: number = 0;
  panelOpenState = false;
  @ViewChild('gridContainer') gridContainer!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  data!: MatTableDataSource<Peticiones>; 
  loading: boolean = true;
  displayedColumns: string[] = ['id', 'correo', 'mensaje', 'fecha', 'estado'];
  clickedRows = new Set<Peticiones>();

  constructor(
    private servicio: PeticioneServicesService,
    @Inject(MatDialog) public dialog: MatDialog // Agrega el decorador @Inject
  ) {}

   name = 'julsanju2004@gmail.com';
  ngOnInit() {
    setTimeout(() => {
      this.loading = false;
    }, 2000);

    this.servicio.obtenerPendientes(this.name).subscribe(
      (response) => {
        this.data = new MatTableDataSource(response);
        this.data.paginator = this.paginator;
        this.data.sort = this.sort;
      },
      (error) => {
        console.error('Error al obtener los productos: ', error);
        this.loading = false;
      }
    );
  }*/

