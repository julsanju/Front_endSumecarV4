import { Component } from '@angular/core';
import { PeticioneServicesService } from 'src/app/services/peticione-services.service';
import { Peticiones } from 'src/app/Interfaces/peticiones';
import { Empleado } from 'src/app/Interfaces/empleado';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-historial-peticiones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial-peticiones.component.html',
  styleUrls: ['./historial-peticiones.component.css']
})
export class HistorialPeticionesComponent {
  dataUser: string = '';
  correo: string = '';
  private rolSubject = new Subject<boolean>();

  //loading 
  isLoading: boolean = true;
  errorOccurred: boolean = false;
  errorImageURL = '';
  //name = 'julsanju2004@gmail.com';
  loading: boolean = true;
  data: Peticiones[] = [];
  data2: Empleado[] = [];
  displayedColumns: string[] = ['id', 'correo', 'mensaje', 'fecha', 'estado'];
  accordeon: { [key: number]: boolean } = {};
  // Variables de paginación
  pageSize: number = 5;
  currentPage: number = 1;

  constructor(private servicio: PeticioneServicesService) { }

  ngOnInit() {
    setTimeout(() => {
      this.loading = false;
    }, 2000);


    this.obtenerPeticiones();


  }

  private obtenerPeticiones() {
    this.obtener_usuario().subscribe(
      (usuario) => {
        this.dataUser = usuario;
        //definimos que el estado de esta pagina es de tipo pendiente
        const estado = "finalizada"
        if (this.dataUser) {
          this.servicio.ObtenerPeticiones(estado, this.dataUser).subscribe(
            (response) => {
              this.data = response;
              this.isLoading = false;
            },
            (error) => {
              console.error('Error al obtener los productos: ', error);
              this.loading = false;
              this.mostrarError();
              this.isLoading = false;
            }
          );
        }
      }
    );
  }


  private obtener_usuario(): Observable<string> {
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


  mostrarError(): void {
    // Lógica para mostrar la imagen de error en lugar del mensaje
    this.errorImageURL = 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/404/404-computer.svg';

    this.errorOccurred = true;
    this.isLoading = false;

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

  //permisos de roles
  //admin
  esAdmin(): boolean {
    // Recupera la información del usuario desde localStorage
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      try {
        // Intenta analizar la cadena como JSON
        const userData = JSON.parse(userDataString);
        return userData.rol === 'admin'; // Verifica la propiedad correcta 'rol'
      } catch (error) {
        // En caso de un error al analizar JSON, puedes manejarlo o simplemente retornar false
        console.error('Error al analizar JSON:', error);
        return false;
      }
    }
    return false; // Retorna false si no se encuentra información del usuario
  }

  //empleado
  esEmpleado(): boolean {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        return userData.rol === 'empleado';
      } catch (error) {
        console.error('Error al aalizar JSON:', error)
        return false;
      }
    }
    return false;

  }

  //cliente
  esCliente(): boolean {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        return userData.rol === 'cliente';
      } catch (error) {
        console.error('Error al aalizar JSON:', error)
        return false;
      }
    }
    return false;
  }

  /** acoordeon de peticiones**/
  abrirCerrarAccordeon(numeroPeticion: number) {
    this.accordeon[numeroPeticion] = !this.accordeon[numeroPeticion];
  }
}
